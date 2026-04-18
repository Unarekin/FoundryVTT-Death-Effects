import { ConfigSource, Constructor, DeathEffectsConfig } from "types";
import { ConfigMixin } from "./ConfigMixin";
import { DefaultDeathEffectsConfig } from "settings";

type RenderOptions = foundry.applications.api.DocumentSheetV2.RenderOptions;

export function PrototypeTokenConfigMixin<t extends Constructor<foundry.applications.sheets.PrototypeTokenConfig>>(base: t) {
  // const DEFAULT_OPTIONS = ((base as Record<string, unknown>).DEFAULT_OPTIONS as foundry.applications.api.DocumentSheetV2.Configuration<TokenDocument>);


  class DeathPrototypeTokenConfig extends ConfigMixin(base) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getDeathEffectFlags(source?: ConfigSource): DeathEffectsConfig | undefined {
      const flags = foundry.utils.deepClone(DefaultDeathEffectsConfig);

      const actualSource = source ?? this.getDeathEffectSource();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const token = (this as any).token as foundry.data.PrototypeToken;

      switch (actualSource) {
        case "token":
          foundry.utils.mergeObject(flags, foundry.utils.deepClone(token.getFlag(__MODULE_ID__, "config") ?? {}));
          break;
        case "actor":
          foundry.utils.mergeObject(flags, foundry.utils.deepClone(token.actor.getFlag(__MODULE_ID__, "config") ?? {}));
          break;
        case "actorType": {
          const typeFlags = token.actor.type ? game.settings?.get(__MODULE_ID__, "actorTypeConfigs")?.[token.actor.type] : undefined;
          if (typeFlags)
            foundry.utils.mergeObject(flags, foundry.utils.deepClone(typeFlags));
          break;
        }
        case "global": {
          const globalSettings = game.settings?.get(__MODULE_ID__, "globalConfig") ?? {};
          if (globalSettings)
            foundry.utils.mergeObject(flags, foundry.utils.deepClone(globalSettings));
          break;
        }
      }


      return flags;
    }
    protected getDeathEffectSource(): ConfigSource {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const token = (this as any).token as foundry.data.PrototypeToken;
      return token.getFlag(__MODULE_ID__, "source") ?? "actorType";
    }
    async _prepareContext(options: RenderOptions) {
      const context = await super._prepareContext(options);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const actor = (this as any).actor as Actor;

      const actorType = (game.i18n && actor && actor && CONFIG.Actor.typeLabels[actor.type]) ? game.i18n.localize(CONFIG.Actor.typeLabels[actor.type]) : "UNKNOWN";

      context.deathEffects.configSourceSelect = {
        token: "DEATH-EFFECTS.CONFIG.SOURCE.TOKEN",
        actor: "DEATH-EFFECTS.CONFIG.SOURCE.ACTOR",
        actorType: game.i18n?.format("DEATH-EFFECTS.CONFIG.SOURCE.TYPE", { type: actorType }) ?? "",
        global: "DEATH-EFFECTS.CONFIG.SOURCE.GLOBAL"
      }

      console.log("Context:", context);
      return context;
    }

    async _onSubmitForm(formConfig: foundry.applications.api.ApplicationV2.FormConfiguration, e: Event | SubmitEvent) {
      await super._onSubmitForm(formConfig, e);
      if (!(e.target instanceof HTMLFormElement)) return console.warn("No form element to submit");
      const formData = foundry.utils.expandObject(new foundry.applications.ux.FormDataExtended(e.target).object);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const token = (this as any).token as foundry.data.PrototypeToken;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const source = (formData as any).deathEffects.source as ConfigSource;


      const update: Record<string, unknown> = {
        prototypeToken: {
          flags: {
            [__MODULE_ID__]: {
              source
            }
          }
        }
      };

      // const fullConfig = foundry.utils.deepClone()

      if (source === "token") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (update.prototypeToken as any).flags[__MODULE_ID__].config = foundry.utils.mergeObject(
          foundry.utils.deepClone(((formData as Record<string, unknown>).deathEffects as { config: DeathEffectsConfig }).config),
          {
            effects: foundry.utils.deepClone(this.deathEffects)
          }
        );

      } else if (source === "actor") {
        update.flags ??= {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (update as any).flags[__MODULE_ID__] = foundry.utils.deepClone((formData as any).deathEffects.config as DeathEffectsConfig);
      }

      console.log("Form submitted:", update);
      await token.actor.update(update);

    }
  }

  return DeathPrototypeTokenConfig;
}