import { ConfigSource, Constructor, DeathEffectsConfig, DeepPartial } from "types";
import { ConfigMixin } from "./ConfigMixin";
import { DefaultDeathEffectsConfig } from "settings";

type RenderOptions = foundry.applications.api.DocumentSheetV2.RenderOptions;

export function TokenConfigMixin<t extends Constructor<foundry.applications.sheets.TokenConfig>>(base: t) {
  const DEFAULT_OPTIONS = ((base as Record<string, unknown>).DEFAULT_OPTIONS as foundry.applications.api.DocumentSheetV2.Configuration<TokenDocument>);


  class DeathTokenConfig extends ConfigMixin(base) {
    static DEFAULT_OPTIONS: DeepPartial<foundry.applications.api.HandlebarsApplicationMixin.Configuration> = {
      ...DEFAULT_OPTIONS,
      actions: {
        ...DEFAULT_OPTIONS.actions,
      }
    }



    _processFormData(event: SubmitEvent, html: HTMLFormElement, data: foundry.applications.ux.FormDataExtended) {
      const parsed = super._processFormData(event, html, data) as Record<string, unknown>;
      const realFormData = foundry.utils.expandObject((new foundry.applications.ux.FormDataExtended(html)).object) as Record<string, unknown>;

      const deathEffects = realFormData.deathEffects as { source: ConfigSource, config: Partial<DeathEffectsConfig> };

      const flags: { source: ConfigSource, config?: DeathEffectsConfig } = { source: deathEffects.source };

      const config = foundry.utils.mergeObject(
        foundry.utils.deepClone(DefaultDeathEffectsConfig),
        foundry.utils.deepClone(deathEffects.config),
      ) as DeathEffectsConfig;

      foundry.utils.mergeObject(config, { effects: foundry.utils.deepClone(this.deathEffects) });

      if (flags.source === "token")
        flags.config = config;

      parsed.flags = { [__MODULE_ID__]: flags };

      return parsed;
    }

    protected async _processSubmitData(event: SubmitEvent, form: HTMLFormElement, formData: foundry.applications.ux.FormDataExtended, options?: unknown) {

      const actualData = foundry.utils.expandObject((new foundry.applications.ux.FormDataExtended(form)).object);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const { config, source } = ((actualData as any).deathEffects as { config: DeathEffectsConfig, source: ConfigSource });
      if (source === "actor" && this.document.actor)
        await this.document.actor.setFlag(__MODULE_ID__, "config", config);

      await super._processSubmitData(event, form, formData, options);

    }

    protected getDeathEffectSource(): ConfigSource {
      return this.document.getFlag(__MODULE_ID__, "source") ?? "actorType";
    }

    protected getDeathEffectFlags(source?: ConfigSource): DeathEffectsConfig | undefined {
      const actualSource = source ?? this.document.getFlag(__MODULE_ID__, "source");

      const flags: DeathEffectsConfig = foundry.utils.deepClone(DefaultDeathEffectsConfig);

      switch (actualSource) {
        case "token":
          foundry.utils.mergeObject(flags, this.document.getFlag(__MODULE_ID__, "config"));
          break;
        case "actor":
          if (this.document.actor)
            foundry.utils.mergeObject(flags, this.document.actor.getFlag(__MODULE_ID__, "config"));
          break;
        case "actorType": {
          const actorTypes = game.settings?.get(__MODULE_ID__, "actorTypeConfigs");
          if (this.document.actor && actorTypes?.[this.document.actor.type])
            foundry.utils.mergeObject(flags, actorTypes[this.document.actor.type]);
          break;
        }
        case "global":
          foundry.utils.mergeObject(flags, game.settings?.get(__MODULE_ID__, "globalConfig") ?? {});
          break;
      }

      return flags;
    }

    async _prepareContext(options: RenderOptions) {
      const context = await super._prepareContext(options);

      const actorType = (game.i18n && this.document.actor && CONFIG.Actor.typeLabels[this.document.actor.type]) ? game.i18n.localize(CONFIG.Actor.typeLabels[this.document.actor.type]) : "UNKNOWN";


      context.deathEffects.configSourceSelect = {
        token: "DEATH-EFFECTS.CONFIG.SOURCE.TOKEN",
        actor: "DEATH-EFFECTS.CONFIG.SOURCE.ACTOR",
        actorType: game.i18n?.format("DEATH-EFFECTS.CONFIG.SOURCE.TYPE", { type: actorType }) ?? "",
        global: "DEATH-EFFECTS.CONFIG.SOURCE.GLOBAL"
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return context as any;
    }

  }
  return DeathTokenConfig;
}