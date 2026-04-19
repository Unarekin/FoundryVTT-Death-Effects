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

    protected async _processSubmitData(event: SubmitEvent, form: HTMLFormElement, formData: foundry.applications.ux.FormDataExtended, options?: unknown) {

      const actualData = foundry.utils.expandObject((new foundry.applications.ux.FormDataExtended(form)).object);

      const { config, source } = ((actualData as Record<string, unknown>).deathEffects) as { config: DeathEffectsConfig, source: ConfigSource };
      if (this.deathEffects) config.effects = foundry.utils.deepClone(this.deathEffects);

      if (source === "actor" && this.document.actor) {
        await this.document.actor.setFlag(__MODULE_ID__, "config", config);
        await this.document.setFlag(__MODULE_ID__, "source", source);
      } else if (source === "token") {
        await this.document.update({
          flags: {
            [__MODULE_ID__]: {
              source,
              config
            }
          }
        });
      }
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

      context.deathEffects.statusEffects = Object.fromEntries(CONFIG.statusEffects.map(eff => [eff.id, eff.name]));

      context.deathEffects.hasTriggerConditions = true;

      if (this.document.actor && CONFIG.Actor.trackableAttributes[this.document.actor.type]) {
        const trackableAttributes = CONFIG.Actor.trackableAttributes[this.document.actor.type];
        context.deathEffects.trackableAttributes = [
          ...(trackableAttributes.bar ?? []),
          ...(trackableAttributes.value ?? [])
        ];
      } else {
        context.deathEffects.trackableAttributes = [];
      }

      context.deathEffects.triggerConditionSelect = [
        { value: "resource", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.RESOURCE.LABEL", disabled: false /* !context.deathEffects.trackableAttributes?.length*/ },
        { value: "status", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.STATUS.LABEL", disabled: false },
        { value: "activeEffect", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.ACTIVEEFFECT.LABEL", disabled: false }
      ]

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