import { ActorTypeSelector, GlobalConfig } from "applications";
import { DeathEffectsConfig, FadeDeathEffect, ShakeDeathEffect, SoundDeathEffect, StopPlaylistDeathEffect, TintDeathEffect } from "./types";
import { SystemIntegrations } from "./systemIntegrations"

export const DefaultDeathEffectsConfig: DeathEffectsConfig = {
  version: __MODULE_VERSION__,
  enabled: false,
  autoHide: true,
  autoTransparent: false,
  autoTriggerCondition: "status",
  statusEffect: "dead",
  effects: []
};


export const DefaultFadeEffect: FadeDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "fade",
  start: 0,
  duration: 500
});

export const DefaultTintEffect: TintDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "tint",
  start: 0,
  tint: 0xFFFFFF
});

export const DefaultShakeEffect: ShakeDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "shake",
  start: 0,
  duration: 500,
  strength: 5,
  easing: "none",
  horizontal: true,
  vertical: false
});

export const DefaultSoundEffect: SoundDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "sound",
  start: 0,
  volume: 1,
  sound: "",
  playAtLocation: false,
  radius: 3
});

export const DefaultStopPlaylistEffect: StopPlaylistDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "stopPlaylist",
  start: 0
});

export const SETTINGS = Object.freeze({
  globalConfig: "globalConfig",
  actorTypeConfigs: "actorTypeConfigs",
  injectTokenConfig: "injectTokenConfig"
})

Hooks.once("init", () => {
  if (game?.system?.id && SystemIntegrations[game?.system?.id]) {
    console.log("Death Effects: Applying system integration for", game.system.title);
    SystemIntegrations[game.system.id]();
  }
  Object.freeze(DefaultDeathEffectsConfig);
});

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
    name: "DEATH-EFFECTS.SETTINGS.MENUS.GLOBAL.LABEL",
    label: "DEATH-EFFECTS.SETTINGS.MENUS.GLOBAL.LABEL",
    hint: "DEATH-EFFECTS.SETTINGS.MENUS.GLOBAL.HINT",
    icon: "fa-solid fa-globe",
    restricted: true,
    type: GlobalConfig
  });

  game.settings.registerMenu(__MODULE_ID__, "actorTypeConfigMenu", {
    name: "DEATH-EFFECTS.SETTINGS.MENUS.ACTORTYPE.LABEL",
    label: "DEATH-EFFECTS.SETTINGS.MENUS.ACTORTYPE.LABEL",
    hint: "DEATH-EFFECTS.SETTINGS.MENUS.ACTORTYPE.HINT",
    icon: "fa-solid fa-user",
    restricted: true,
    type: ActorTypeSelector
  })

  game.settings.register(__MODULE_ID__, SETTINGS.injectTokenConfig, {
    name: "DEATH-EFFECTS.SETTINGS.INJECTTOKENCONFIG.LABEL",
    hint: "DEATH-EFFECTS.SETTINGS.INJECTTOKENCONFIG.HINT",
    config: true,
    scope: "user",
    requiresReload: true,
    type: Boolean,
    default: true
  });
})