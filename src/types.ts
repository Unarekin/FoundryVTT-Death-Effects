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

export const EffectTypes = [] as const;
export type EffectType = typeof EffectTypes[number];

interface BaseDeathEffectsConfig {
  version: string;
  enabled: boolean;
  flash: boolean;
  tint: string;
  shake: boolean;
  autoHide: boolean;
  autoTransparent: boolean;
  type: EffectType;
}

export type DeathEffectsConfig = BaseDeathEffectsConfig;

export interface DeathPlaceable {
  deathEffectsConfig: DeathEffectsConfig;
  playDeathEffects(config?: DeathEffectsConfig): Promise<void>;
}