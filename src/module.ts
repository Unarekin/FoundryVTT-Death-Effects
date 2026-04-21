import { BaseDeathEffect, BaseEffectApplication, FadeEffect, FadeEffectApplication, ShakeEffect, ShakeEffectApplication, SoundEffect, SoundEffectApplication, TintEffect, TintEffectApplication } from "effects";
import "./hooks";
import "./settings";
import "./sockets";
import "./helpers";
import "./tokenHUD";

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
    }
  }
}