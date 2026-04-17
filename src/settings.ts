import { DeathEffectsConfig } from "./types";

export const DefaultDeathEffectsConfig: DeathEffectsConfig = {
  version: __MODULE_VERSION__,
  enabled: true,
  autoHide: true,
  autoTransparent: false,
  effects: []
}

export const SETTINGS = Object.freeze({
  globalConfig: "globalConfig",
  actorTypeConfigs: "actorTypeConfigs"
})

Hooks.once("ready", () => {
  if (!game.settings) return;

  game.settings.register(__MODULE_ID__, SETTINGS.globalConfig, {
    name: "globalConfig",
    config: false,
    scope: "world",
    requiresReload: false,
    type: Object,
    default: foundry.utils.deepClone(DefaultDeathEffectsConfig)
  });

  game.settings.register(__MODULE_ID__, SETTINGS.actorTypeConfigs, {
    name: "actorTypeConfigs",
    config: false,
    scope: "world",
    requiresReload: false,
    type: Object,
    default: {}
  });
})