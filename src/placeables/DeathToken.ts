import { DeathEffectsConfig, DeepPartial } from "types";
import { PlaceableMixin } from "./DeathPlaceable";
import { DefaultDeathEffectsConfig } from "settings";


type Constructor = new (...args: any[]) => foundry.canvas.placeables.Token;

export function TokenMixin(base: Constructor) {
  const tokenClass = class DeathToken extends PlaceableMixin<Constructor>(base) {
    public get deathEffectsConfig(): DeathEffectsConfig {

      const configSource = this.document.getFlag(__MODULE_ID__, "source") ?? "actor";
      const globalConfig = game.settings?.settings?.get(`${__MODULE_ID__}.globalConfig`) ? game.settings.get(__MODULE_ID__, "globalConfig") : undefined;
      const actorTypeConfigs = game.settings?.settings?.get(`${__MODULE_ID__}.actorTypeConfigs`) ? game.settings.get(__MODULE_ID__, "actorTypeConfigs") : undefined;


      let flags: DeepPartial<DeathEffectsConfig> | undefined = undefined;
      switch (configSource) {
        case "actor":
          flags = foundry.utils.deepClone(this.document.actor?.getFlag(__MODULE_ID__, "config"));
          break;
        case "token":
          flags = foundry.utils.deepClone(this.document.getFlag(__MODULE_ID__, "config"));
          break;
        case "actorType":
          if (this.document?.actor && actorTypeConfigs?.[this.document.actor.type])
            flags = foundry.utils.deepClone(actorTypeConfigs[this.document.actor.type]);
          break;
        case "global":
          if (globalConfig)
            flags = foundry.utils.deepClone(globalConfig);
          break;
      }

      const actualConfig = foundry.utils.deepClone(DefaultDeathEffectsConfig);
      if (flags) foundry.utils.mergeObject(actualConfig, flags);
      return actualConfig;
    }

  }
  return tokenClass as unknown as typeof foundry.canvas.placeables.Token;
}