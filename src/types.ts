export type IsObject<T> = T extends Readonly<Record<string, any>>
  ? T extends AnyArray | AnyFunction
  ? false
  : true
  : false;

/**
 * Recursively sets keys of an object to optional. Used primarily for update methods
 * @internal
 */
export type DeepPartial<T> = T extends unknown
  ? IsObject<T> extends true
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T
  : T;

export type AnyArray = readonly unknown[];
export type AnyFunction = (arg0: never, ...args: never[]) => unknown;

export type Constructor<t> = new (...args: any[]) => t;

export const EffectTypes = ["tint", "fade"] as const;
export type EffectType = typeof EffectTypes[number];

export const ConfigSources = ["token", "actor", "actorType", "global"] as const;
export type ConfigSource = typeof ConfigSources[number];

interface BaseDeathEffect {
  version: string;
  id: string;
  type: EffectType;
  start: number;
}

export interface DurationDeathEffect {
  duration: number;
}

type FadeDeathEffect = BaseDeathEffect & DurationDeathEffect & ({
  type: "fade";
})

interface TintDeathEffect extends BaseDeathEffect {
  type: "tint";
  tint: PIXI.ColorSource;
}

export type DeathEffect = BaseDeathEffect | FadeDeathEffect | TintDeathEffect;

interface BaseDeathEffectsConfig {
  version: string;
  enabled: boolean;
  autoHide: boolean;
  autoTransparent: boolean;
  effects: DeathEffect[];
}

export type DeathEffectsConfig = BaseDeathEffectsConfig;

export interface DeathPlaceable {
  deathEffectsConfig: DeathEffectsConfig;
  playDeathEffects(config?: DeathEffectsConfig): Promise<void>;
}