import "./hooks";
import "./settings";
import "./sockets";
import "./helpers";
import "./tokenHUD";
import "./HTMLDocumentPickerElement";
import { FadeEffectApplication, BaseEffectApplication, TintEffectApplication, ShakeEffectApplication, SoundEffectApplication, StopPlaylistEffectApplication, StartPlaylistEffectApplication, ScreenFlashEffectApplication, MacroEffectApplication, ScreenShakeEffectApplication, FlashEffectApplication, TokenMagicEffectApplication, SlideEffectApplication, MeltEffectApplication, DissolveEffectApplication, DustEffectApplication, CrumbleEffectApplication } from "applications";
import { FadeEffect, BaseDeathEffect, TintEffect, ShakeEffect, SoundEffect, StopPlaylistEffect, StartPlaylistEffect, ScreenFlashEffect, MacroEffect, ScreenShakeEffect, FlashEffect, TokenMagicEffect, SlideEffect, MeltEffect, DissolveEffect, DustEffect, CrumbleEffect } from "effects";

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
    },
    screenShake: {
      cls: ScreenShakeEffect as typeof BaseDeathEffect,
      app: ScreenShakeEffectApplication as typeof BaseEffectApplication
    },
    flash: {
      cls: FlashEffect as typeof BaseDeathEffect,
      app: FlashEffectApplication as typeof BaseEffectApplication
    },
    slide: {
      cls: SlideEffect as typeof BaseDeathEffect,
      app: SlideEffectApplication as typeof BaseEffectApplication
    },
    melt: {
      cls: MeltEffect as typeof BaseDeathEffect,
      app: MeltEffectApplication as typeof BaseEffectApplication
    },
    dissolve: {
      cls: DissolveEffect as typeof BaseDeathEffect,
      app: DissolveEffectApplication as typeof BaseEffectApplication
    },
    dust: {
      cls: DustEffect as typeof BaseDeathEffect,
      app: DustEffectApplication as typeof BaseEffectApplication
    },
    crumble: {
      cls: CrumbleEffect as typeof BaseDeathEffect,
      app: CrumbleEffectApplication as typeof BaseEffectApplication
    }
  }
}

Hooks.on("ready", () => {
  // Only add the Token Magic FX effect if TMFX is actually active
  if (game.modules?.get("tokenmagic")?.active) {
    CONFIG.DeathEffects.effects.tokenMagic = {
      cls: TokenMagicEffect as typeof BaseDeathEffect,
      app: TokenMagicEffectApplication as typeof BaseEffectApplication
    }
  }
})