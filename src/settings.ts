import { GlobalConfig } from "applications";
import { DeathEffectsConfig, FadeDeathEffect } from "./types";

export const DefaultDeathEffectsConfig: DeathEffectsConfig = Object.freeze({
  version: __MODULE_VERSION__,
  enabled: true,
  autoHide: true,
  autoTransparent: false,
  autoTriggerCondition: "resource",
  resource: "",
  effects: []
});

export const DefaultFadeEffect: FadeDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "fade",
  start: 0,
  duration: 500
});

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

  game.settings.registerMenu(__MODULE_ID__, "globalConfigMenu", {
    name: "DEATH-EFFECTS.CONFIG.MENUS.GLOBAL.LABEL",
    label: "DEATH-EFFECTS.CONFIG.MENUS.GLOBAL.LABEL",
    hint: "DEATH-EFFECTS.CONFIG.MENUS.GLOBAL.HINT",
    icon: "fa-solid fa-globe",
    restricted: true,
    type: GlobalConfig
  });
})