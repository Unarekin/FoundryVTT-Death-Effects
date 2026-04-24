import "./hooks";
import "./settings";
import "./sockets";
import "./helpers";
import "./tokenHUD";
import "./HTMLDocumentPickerElement";
import { FadeEffectApplication, BaseEffectApplication, TintEffectApplication, ShakeEffectApplication, SoundEffectApplication, StopPlaylistEffectApplication, StartPlaylistEffectApplication, ScreenFlashEffectApplication, MacroEffectApplication } from "applications";
import { FadeEffect, BaseDeathEffect, TintEffect, ShakeEffect, SoundEffect, StopPlaylistEffect, StartPlaylistEffect, ScreenFlashEffect, MacroEffect } from "effects";

CONFIG.DeathEffects = {
  effects: {
    fade: {
      cls: FadeEffect as typeof BaseDeathEffect,
      app: FadeEffectApplication as typeof BaseEffectApplication
    },
    tint: {
      cls: TintEffect as typeof BaseDeathEffect,
      app: TintEffectApplication as typeof BaseEffectApplication
    },
    shake: {
      cls: ShakeEffect as typeof BaseDeathEffect,
      app: ShakeEffectApplication as typeof BaseEffectApplication
    },
    sound: {
      cls: SoundEffect as typeof BaseDeathEffect,
      app: SoundEffectApplication as typeof BaseEffectApplication
    },
    stopPlaylist: {
      cls: StopPlaylistEffect as typeof BaseDeathEffect,
      app: StopPlaylistEffectApplication as typeof BaseEffectApplication
    },
    startPlaylist: {
      cls: StartPlaylistEffect as typeof BaseDeathEffect,
      app: StartPlaylistEffectApplication as typeof BaseEffectApplication
    },
    screenFlash: {
      cls: ScreenFlashEffect as typeof BaseDeathEffect,
      app: ScreenFlashEffectApplication as typeof BaseEffectApplication
    },
    macro: {
      cls: MacroEffect as typeof BaseDeathEffect,
      app: MacroEffectApplication as typeof BaseEffectApplication
    }
  }
}