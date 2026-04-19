/* eslint-disable @typescript-eslint/unbound-method */
import { ConfigSource, Constructor, DeathEffect, DeepPartial, DeathEffectsConfig as FlagConfig } from "types";
import { PlaceableConfigContext } from "./types"
import { DefaultDeathEffectsConfig } from "settings";
import { templatePath } from "functions";
import { TimelineEditor } from "./TimelineEditor";


type RenderOptions = foundry.applications.api.DocumentSheetV2.RenderOptions;
type TabsConfiguration = foundry.applications.api.ApplicationV2.TabsConfiguration

export function ConfigMixin<t extends Constructor<foundry.applications.api.DocumentSheetV2.Any>>(base: t) {
  const TABS = ((base as Record<string, unknown>).TABS as Record<string, TabsConfiguration>);
  const PARTS = ((base as Record<string, unknown>).PARTS as Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>);
  const DEFAULT_OPTIONS = ((base as Record<string, unknown>).DEFAULT_OPTIONS as foundry.applications.api.DocumentSheetV2.Configuration<TokenDocument>);

  abstract class DeathEffectsConfig extends base {

    protected deathEffects: DeathEffect[] | undefined = undefined;


    static TABS: Record<string, TabsConfiguration> = {
      ...TABS,
      sheet: {
        ...TABS.sheet,
        tabs: [
          ...(TABS.sheet.tabs ?? []),
          {
            id: "deathEffects",
            cssClass: "",
            icon: "fa-solid fa-skull"
          }
        ]
      }
    }

    static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
      ...PARTS,
      deathEffects: {
        template: templatePath('config')
      },
    }

    static DEFAULT_OPTIONS: DeepPartial<foundry.applications.api.HandlebarsApplicationMixin.Configuration> = {
      ...DEFAULT_OPTIONS,
      actions: {
        ...DEFAULT_OPTIONS.actions,
        editTimeline: DeathEffectsConfig.EditTimeline
      }
    }


    static async EditTimeline(this: DeathEffectsConfig) {
      try {
        // await (new TimelineEditor()).render({ force: true });
        const timeline = await new TimelineEditor().Edit(this.deathEffects ? foundry.utils.deepClone(this.deathEffects) : []);
        if (timeline)
          this.deathEffects = foundry.utils.deepClone(timeline);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
      }
    }

    protected overrideDeathEffectConfigSource: ConfigSource | undefined = undefined;

    protected abstract getDeathEffectFlags(source?: ConfigSource): FlagConfig | undefined;
    protected abstract getDeathEffectSource(): ConfigSource;

    protected toggleDeathEffectForm(enabled: boolean) {
      const elems = this.element.querySelectorAll(`[data-toggle-death-effects]`);
      for (const elem of elems) {
        if (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement) {
          elem.disabled = !enabled;
        } else if (enabled) {
          elem.removeAttribute("disabled");
          elem.classList.remove("disabled");
        } else {
          elem.setAttribute("disabled", "disabled");
          elem.classList.add("disabled");
        }
      }
    }


    _onClose(options: RenderOptions) {
      super._onClose(options);
      this.overrideDeathEffectConfigSource = undefined;
      this.deathEffects = undefined;
    }

    async _onRender(context: PlaceableConfigContext<foundry.abstract.Document.Any>, options: RenderOptions) {
      await super._onRender(context, options);

      const sourceSelect = this.element.querySelector(`[name="deathEffects.source"]`);
      if (sourceSelect instanceof HTMLSelectElement) {
        this.toggleDeathEffectForm(sourceSelect.value === "token" || sourceSelect.value === "actor");
        sourceSelect.addEventListener("change", () => {
          // this.toggleDeathEffectForm(sourceSelect.value === "token" || sourceSelect.value === "actor");
          this.overrideDeathEffectConfigSource = sourceSelect.value as ConfigSource;
          this.deathEffects = undefined;
          this.render().catch(console.error);
        })
      }
    }


    async _prepareContext(options: RenderOptions): Promise<PlaceableConfigContext<foundry.abstract.Document.Any>> {
      const context = await super._prepareContext(options) as PlaceableConfigContext<foundry.abstract.Document.Any>;

      // const config = ((this.document.flags as Record<string, unknown>)[__MODULE_ID__] as FlagConfig);
      const config = this.getDeathEffectFlags(this.overrideDeathEffectConfigSource);

      context.deathEffects = {
        source: this.overrideDeathEffectConfigSource ?? this.getDeathEffectSource(),
        config: foundry.utils.mergeObject(
          foundry.utils.deepClone(DefaultDeathEffectsConfig),
          config ?? {}
        ),
        configSourceSelect: {
          global: "DEATH-EFFECTS.CONFIG.SOURCE.GLOBAL"
        }
      }

      if (this.deathEffects)
        context.deathEffects.config.effects = foundry.utils.deepClone(this.deathEffects);
      else
        this.deathEffects = foundry.utils.deepClone(context.deathEffects.config.effects);

      return context;
    }
  }

  if (DeathEffectsConfig.PARTS?.footer) {
    const footer = DeathEffectsConfig.PARTS.footer;
    delete DeathEffectsConfig.PARTS.footer;
    DeathEffectsConfig.PARTS.footer = footer;
  }

  return DeathEffectsConfig;
}