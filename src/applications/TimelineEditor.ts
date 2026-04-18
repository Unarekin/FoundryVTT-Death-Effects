/* eslint-disable @typescript-eslint/unbound-method */
import { templatePath } from "functions";
import { TimelineContext } from "./types";
import { DeathEffect, DeepPartial, DurationDeathEffect } from "types";

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
      cancel: TimelineEditor.Cancel
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
  }



  async _prepareContext(options: Options): Promise<TimelineContext> {
    const context = await super._prepareContext(options) as TimelineContext;

    context.rootId = foundry.utils.randomID();

    context.effects = foundry.utils.deepClone(this.effects ?? []);

    context.buttons = [
      { type: "button", action: "cancel", icon: "fa-solid fa-times", label: "Cancel" },
      { type: "submit", action: "submit", icon: 'fa-solid fa-save', label: "Save" }
    ]

    return context;
  }

  async _onRender(context: TimelineContext, options: Options) {
    await super._onRender(context, options);

    const timeline = new timelineModule.Timeline({
      id: `${context.rootId}-timeline`,
      stepSmallPx: 10,
      snapStep: 10,
      stepPx: 250,
      timelineDraggable: false,
    });


    timeline.setModel({
      rows: context.effects.map(effect => {
        const durationEffect = effect as DurationDeathEffect;
        return {
          title: effect.type,
          keyframes: [
            { val: effect.start },
            ...(typeof durationEffect.duration === "number" ? [{ val: effect.start + durationEffect.duration }] : [])
          ]
        }
      })
    });
  }

  constructor(protected effects: DeathEffect[] = [], options?: Configuration) {
    super(options)

  }
}