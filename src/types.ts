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

export const EffectTypes = ["fade"] as const;
export type EffectType = typeof EffectTypes[number];

export const ConfigSources = ["token", "actor", "actorType", "global"] as const;
export type ConfigSource = typeof ConfigSources[number];

interface BaseDeathEffect {
  version: string;
  id: string;
  type: EffectType;
  start: number;
  label: string;
}

export interface DurationDeathEffect {
  duration: number;
}

export type FadeDeathEffect = BaseDeathEffect & DurationDeathEffect & ({
  type: "fade";
})

export type DeathEffect = BaseDeathEffect | FadeDeathEffect;

export interface DeathEffectsConfig {
  version: string;
  enabled: boolean;
  autoHide: boolean;
  autoTransparent: boolean;
  effects: DeathEffect[];
}

export interface DeathPlaceable extends foundry.canvas.placeables.PlaceableObject {
  getDeathSpriteObject(): PIXI.DisplayObject | undefined;
  deathEffectsConfig: DeathEffectsConfig;
  playDeathEffects(config?: DeathEffectsConfig, localOnly?: boolean): Promise<void>;
}


/*************************************************
 * Socket Types
 *************************************************/

export const MESSAGE_TYPES = ["play"] as const;
export type SocketMessageType = typeof MESSAGE_TYPES[number];


interface BaseSocketMessage {
  id: string;
  type: SocketMessageType;
  timestamp: number;
  sender: string;
  users: string[];
}

interface PlaySocketMessage extends BaseSocketMessage {
  type: "play";
  config: DeathEffectsConfig;
  target: string;
}

export type SocketMessage = BaseSocketMessage | PlaySocketMessage;
