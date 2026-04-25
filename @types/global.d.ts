import { ConfigSource, DeathEffectsConfig, EffectType, PartialBy, PresetDefinition } from "types";
import { BaseDeathEffect } from "effects"
import { BaseEffectApplication } from "applications";
import * as gsapType from "gsap";
import * as timelineModuleType from "animation-timeline-js"

declare global {

  const __MODULE_ID__ = "death-effects";
  declare const __DEV__: boolean;
  declare const __MODULE_TITLE__: string;
  declare const __MODULE_VERSION__: string;

  declare const gsap: gsapType;
  const timelineModule = timelineModuleType;

  declare const TokenMagic: any;

  declare module '*.scss';

  declare module '*.frag' {
    const content: string;
    export default content;
  }

  declare module '*.vert' {
    const content: string;
    export default content;
  }

  interface CONFIG {
    DeathEffects: {
      presets: Record<string, PresetDefinition>;
      effects: PartialBy<Record<EffectType, {
        app: typeof BaseEffectApplication,
        cls: typeof BaseDeathEffect
      }>, "tokenMagic" | "spriteAnimation">;
    }
  }
}

declare module "fvtt-types/configuration" {

  interface SettingConfig {
    "death-effects.globalConfig": DeathEffectsConfig;
    "death-effects.actorTypeConfigs": Record<string, DeathEffectsConfig>;
    "death-effects.injectTokenConfig": boolean;
  }

  interface FlagConfig {
    Token: {
      [__MODULE_ID__]: {
        source: ConfigSource,
        config: DeathEffectsConfig
      }
    },
    Actor: {
      [__MODULE_ID__]: {
        config: DeathEffectsConfig
      }
    }
  }
}