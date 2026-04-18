import { ConfigSource, DeathEffectsConfig } from "types";
import * as timelineModuleType from "animation-timeline-js"

declare module '*.scss';

declare module '*.frag' {
  const content: string;
  export default content;
}

declare module '*.vert' {
  const content: string;
  export default content;
}

declare global {

  const __MODULE_ID__ = "death-effects";
  declare const __DEV__: boolean;
  declare const __MODULE_TITLE__: string;
  declare const __MODULE_VERSION__: string;


  const timelineModule = timelineModuleType;

  interface Game {
    DeathEffects: {
      effects: Record<string, unknown>;
    }
  }
}

declare module "fvtt-types/configuration" {

  interface SettingConfig {
    "death-effects.globalConfig": DeathEffectsConfig;
    "death-effects.actorTypeConfigs": Record<string, DeathEffectsConfig>;
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