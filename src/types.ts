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

export const AutoTriggerConditions = ["status", "resource", "activeEffect"] as const;
export type AutoTriggerCondition = typeof AutoTriggerConditions[number];

interface BaseDeathEffectsConfig {
  version: string;
  enabled: boolean;
  autoHide: boolean;
  autoTransparent: boolean;
  effects: DeathEffect[];
  autoTriggerCondition: AutoTriggerCondition;
}

interface StatusTriggerConfig extends BaseDeathEffectsConfig {
  autoTriggerCondition: "status";
  statusEffect: string;
}

interface ResourceTriggerConfig extends BaseDeathEffectsConfig {
  autoTriggerCondition: "resource";
  resource: string;
}

interface ActiveEffectTriggerConfig extends BaseDeathEffectsConfig {
  autoTriggerCondition: "activeEffect";
  activeEffect: string;
}

export type DeathEffectsConfig = StatusTriggerConfig | ResourceTriggerConfig | ActiveEffectTriggerConfig;

export interface DeathPlaceable extends foundry.canvas.placeables.PlaceableObject {
  getDeathSpriteObject(): PIXI.DisplayObject | undefined;
  deathEffectsConfig: DeathEffectsConfig;
  playDeathEffects(config?: DeathEffectsConfig, localOnly?: boolean): Promise<void>;
  checkAutoTriggerResource<t extends foundry.abstract.Document.Any = foundry.abstract.Document.Any>(doc: t, delta: DeepPartial<t>): void;
  checkAutoTriggerStatus(status: string): void;
  // checkAutoTriggerStatus
  // checkAutoTriggerActiveEffect
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
