/* eslint-disable @typescript-eslint/unbound-method */
import { templatePath } from "functions";
import { DeathEffectContext, TimelineContext } from "./types";
import { DeathEffect, DeepPartial, DurationDeathEffect, EffectType } from "types";
import { simpleSelect } from "./SimpleSelect";
import { Timeline } from "animation-timeline-js";

type Options = foundry.applications.api.ApplicationV2.RenderOptions;
type Configuration = foundry.applications.api.ApplicationV2.Configuration;



export class TimelineEditor extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    window: {
      title: "DEATH-EFFECTS.TIMELINE.TITLE",
      contentClasses: ["standard-form"],
      resizable: true
    },
    position: {
      width: 600
    },
    actions: {
      submit: TimelineEditor.Submit,
      cancel: TimelineEditor.Cancel,
      addEffect: TimelineEditor.AddEffect,
      editEffect: TimelineEditor.EditEffect,
      removeEffect: TimelineEditor.RemoveEffect
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("timeline"),
      scrollable: ["scrollable"]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  static async Submit(this: TimelineEditor) {
    if (this.#resolve) {
      this.#resolve(foundry.utils.deepClone(this.effects));
    }
    this.#editPromise = undefined;
    this.#resolve = undefined;
    await this.close();
  }

  static async Cancel(this: TimelineEditor) {
    await this.close();
  }

  static async RemoveEffect(this: TimelineEditor, e: Event, elem: HTMLElement) {
    try {
      const id = elem.dataset.effect;
      if (!id) return console.warn("No effect ID");
      const effect = this.effects.find(elem => elem.id === id);
      if (!effect) return console.warn("Effect not found in array");

      const confirmed = await foundry.applications.api.DialogV2.confirm({
        window: { title: "DEATH-EFFECTS.CONFIG.REMOVEEFFECT.TITLE" },
        content: `<p>${game.i18n?.localize("DEATH-EFFECTS.CONFIG.REMOVEEFFECT.MESSAGE")}</p>`
      }) as boolean;
      if (!confirmed) return;
      const index = this.effects.findIndex(effect => effect.id === id);
      if (index !== -1) this.effects.splice(index, 1);
      await this.render();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
    }
  }

  static async EditEffect(this: TimelineEditor, e: Event, elem: HTMLElement) {
    try {
      const id = elem.dataset.effect;
      if (!id) return console.warn("No effect ID");
      const effect = this.effects.find(elem => elem.id === id);
      if (!effect) return console.warn("Effect not found in array");

      const def = CONFIG.DeathEffects.effects[effect.type];
      if (!def) throw new Error(`Unknown effect type: ${effect.type}`);

      const edited = await def.app.Edit(foundry.utils.deepClone(effect));
      if (!edited) return;

      const index = this.effects.findIndex(effect => effect.id === id);
      if (index !== -1) this.effects.splice(index, 1, edited);
      await this.render();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
    }
  }

  protected _generateTooltipFromFile(name: string, description: string, icon: string, file?: string): string {
    const tooltip = document.createElement("div");
    tooltip.classList.add("toolclip", "themed", "theme-dark");

    if (file) {
      const isVideo = foundry.helpers.media.VideoHelper.hasVideoExtension(file);
      if (isVideo) {
        const vid = document.createElement("video");
        vid.style.height = "auto";
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
        const src = document.createElement("source");
        src.src = file;
        vid.appendChild(src);
        tooltip.appendChild(vid);
      } else {
        const img = document.createElement("img");
        img.src = file;
        tooltip.appendChild(img);
      }
    }

    const title = document.createElement("h4");
    const iconElem = document.createElement("i");
    iconElem.classList.add(...icon.split(" "));
    iconElem.style.float = "left";
    title.appendChild(iconElem);
    title.innerHTML += game.i18n?.localize(name) ?? name;
    tooltip.appendChild(title);

    const desc = document.createElement("p");
    desc.innerText = game.i18n?.localize(description) ?? description;
    tooltip.appendChild(desc);

    return tooltip.outerHTML.replaceAll("\"", "'");
  }

  static async AddEffect(this: TimelineEditor) {
    try {
      const selectOptions = Object.entries(CONFIG.DeathEffects.effects).map(([key, val]) => ({
        key,
        label: val.cls.Name,
        tooltip: this._generateTooltipFromFile(val.cls.Name, val.cls.Description, val.cls.Icon, val.cls.Preview),
        icon: val.cls.Icon
      })).sort((a, b) => a.label.localeCompare(b.label));
      const key = await simpleSelect<EffectType>(selectOptions, "DEATH-EFFECTS.EFFECTS.COMMON.ADD.TITLE", "DEATH-EFFECTS.EFFECTS.COMMON.ADD.TEXT");

      if (!key) return;

      const def = CONFIG.DeathEffects.effects[key];
      if (!def) return;

      const effect = await def.app.Edit();
      if (!effect) return;

      this.effects.push(effect);
      await this.render();

    } catch (err) {
      console.error(err);
      if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
    }
  }

  #editPromise: Promise<DeathEffect[] | undefined> | undefined = undefined;
  #resolve: ((effects?: DeathEffect[]) => void) | undefined = undefined;

  public async Edit(effects: DeathEffect[]): Promise<DeathEffect[] | undefined> {
    if (this.#editPromise) return this.#editPromise;
    this.#editPromise = new Promise(resolve => {
      this.#resolve = resolve;
      this.effects = effects;
      this.render({ force: true }).catch(console.error);
    })
    return this.#editPromise;
  }

  _onClose(options: Options) {
    super._onClose(options);
    if (this.#resolve) this.#resolve();
    this.#resolve = undefined;
    this.#editPromise = undefined;
    if (this.timeline) this.timeline.dispose();
    this.timeline = undefined;
  }



  async _prepareContext(options: Options): Promise<TimelineContext> {
    const context = await super._prepareContext(options) as TimelineContext;

    context.rootId = foundry.utils.randomID();

    context.effects = [];
    for (const effect of this.effects) {
      const def = CONFIG.DeathEffects.effects[effect.type];
      if (!def) {
        ui.notifications?.error(`Unknown effect type: ${effect.type}`);
        continue;
      }

      const effectContext: DeathEffectContext = {
        ...effect,
        actualLabel: effect.label ? `${effect.label} (${game.i18n?.localize(def.cls.Name) ?? def.cls.Name})` : def.cls.Name,
        editableDuration: def.cls.canEditDuration(effect)
      }

      // if (typeof (effect as { duration?: number }).duration === "number") {
      const duration = def.cls.getDuration(effect);
      if (duration instanceof Promise)
        (effectContext as { duration: number }).duration = await duration;
      else
        (effectContext as { duration: number }).duration = duration;

      // }

      context.effects.push(effectContext);
    }

    // context.effects = foundry.utils.deepClone(this.effects ?? []).map(effect => {
    //   const def = CONFIG.DeathEffects.effects[effect.type];
    //   if (!def) {
    //     // throw new Error(`Unknown effect type: ${effect.type}`);
    //     ui.notifications?.error(`Unknown effect type: ${effect.type}`);
    //     return undefined
    //   } else {
    //     return {
    //       ...effect,
    //       actualLabel: effect.label ? `${effect.label} (${game.i18n?.localize(def.cls.Name) ?? def.cls.Name})` : def.cls.Name,
    //     }
    //   }
    // }).filter(item => !!item);



    context.buttons = [
      { type: "button", action: "cancel", icon: "fa-solid fa-times", label: "Cancel" },
      { type: "submit", action: "submit", icon: 'fa-solid fa-save', label: "Save" }
    ]

    return context;
  }

  protected timeline: Timeline | undefined = undefined;

  async _onRender(context: TimelineContext, options: Options) {
    await super._onRender(context, options);

    const timeline = new timelineModule.Timeline({
      id: `${context.rootId}-timeline`,
      stepSmallPx: 10,
      snapStep: 10,
      stepPx: 250,
      timelineDraggable: false,
    });


    if (this.timeline)
      this.timeline.dispose();
    this.timeline = timeline;

    timeline.setModel({
      rows: context.effects.map(effect => {
        const durationEffect = effect as DurationDeathEffect;
        return {
          id: effect.id,
          keyframes: [
            { val: effect.start },
            ...(typeof durationEffect.duration === "number" ? [{ val: effect.start + durationEffect.duration }] : [])
          ]
        }
      })
    });

    timeline._formatUnitsText = (val) => { return `${val}ms`; }


    timeline.onDragFinished((event) => {
      event.elements?.forEach(elem => {
        if (!elem.row) return console.warn(`No row for dragged element`);
        if (elem.row.keyframes?.length !== 2) return console.warn(`Unexpected number of keyframes: ${elem.row.keyframes?.length}`);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const effect = this.effects.find(effect => effect.id === (elem.row as any)?.id);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (!effect) return console.warn(`No effect found with id ${(elem.row as any)?.id}`);

        effect.start = elem.row.keyframes[0].val;
        const durationEff = effect as DurationDeathEffect;
        if (typeof durationEff.duration === "number")
          durationEff.duration = Math.max(elem.row.keyframes[1].val - effect.start, 0);
      });
      this.render().catch(console.error);
    })

  }

  protected async addEffect(key: keyof typeof CONFIG.DeathEffects.effects) {
    try {
      const effect = await CONFIG.DeathEffects.effects[key].app.Edit()
      if (!effect) return;
      this.effects.push(effect);
      await this.render();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
    }
  }

  constructor(protected effects: DeathEffect[] = [], options?: Configuration) {
    super(options)

  }
}