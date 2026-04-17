import { DeathEffectsConfig } from "types";

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

}

declare module "fvtt-types/configuration" {
  interface FlagConfig {
    Token: {
      [__MODULE_ID__]: DeathEffectsConfig
    }
  }
}