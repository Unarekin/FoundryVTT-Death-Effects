import { DeathEffectsConfig, FadeDeathEffect, FlashDeathEffect, MacroDeathEffect, ScreenFlashDeathEffect, ScreenShakeDeathEffect, ShakeDeathEffect, SoundDeathEffect, StartPlaylistDeathEffect, StopPlaylistDeathEffect, TintDeathEffect, TokenMagicDeathEffect } from "./types";

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

export const DefaultStartPlaylistEffect: StartPlaylistDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "startPlaylist",
  start: 0,
  playlist: "",
  sound: ""
});

export const DefaultScreenFlashEffect: ScreenFlashDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "screenFlash",
  start: 0,
  duration: 150,
  color: "#FFFFFF",
  backgroundOnly: false
})

export const DefaultMacroEffect: MacroDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "macro",
  start: 0,
  macro: "" as `Macro.${string}`,
  gmOnly: false
});

export const DefaultScreenShakeEffect: ScreenShakeDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "screenShake",
  start: 0,
  duration: 500,
  strength: 5,
  backgroundOnly: false,
  easing: "none"
});

export const DefaultFlashEffect: FlashDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "flash",
  start: 0,
  duration: 150,
  color: "#FFFFFF",
  replace: true
});

export const DefaultTokenMagicEffect: TokenMagicDeathEffect = Object.freeze({
  id: "",
  version: __MODULE_VERSION__,
  label: "",
  type: "tokenMagic",
  start: 0,
  tmfxParams: []
})