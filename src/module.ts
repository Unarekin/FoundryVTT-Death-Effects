import { BaseDeathEffect, BaseEffectApplication, FadeEffect, FadeEffectApplication } from "effects";
import "./hooks";
import "./settings";

CONFIG.DeathEffects = {
  effects: {
    fade: {
      cls: FadeEffect as typeof BaseDeathEffect,
      app: FadeEffectApplication as typeof BaseEffectApplication
    }
  }
}