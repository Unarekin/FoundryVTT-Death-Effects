import { Constructor, DeepPartial } from "types";
import { ConfigMixin } from "./ConfigMixin";

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