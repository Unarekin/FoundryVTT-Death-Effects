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

// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;


export const EffectTypes = [
  "crumble",
  "dissolve",
  "dust",
  "fade",
  "flash",
  "macro",
  "melt",
  "screenFlash",
  "screenShake",
  "shake",
  "slide",
  "sound",
  "spriteAnimation",
  "startPlaylist",
  "stopPlaylist",
  "tint",
  "tokenMagic"
] as const;
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

export interface EasingDeathEffect {
  easing: gsap.EaseString;
  easingParams: string;
}

export type FadeDeathEffect = BaseDeathEffect & DurationDeathEffect & EasingDeathEffect & ({
  type: "fade";
})

export interface TintDeathEffect extends BaseDeathEffect {
  type: "tint";
  start: number;
  tint: PIXI.ColorSource;
  replace: boolean;
}

export type ShakeDeathEffect = BaseDeathEffect & DurationDeathEffect & EasingDeathEffect & ({
  strength: number;
  type: "shake",
  horizontal: boolean;
  vertical: boolean;
})

export type StopPlaylistDeathEffect = BaseDeathEffect;


export interface SoundDeathEffect extends BaseDeathEffect {
  type: "sound";
  sound: string;
  volume: number;
  playAtLocation: boolean;
  radius: number;
}

export interface StartPlaylistDeathEffect extends BaseDeathEffect {
  type: "startPlaylist";
  playlist: string;
  sound?: string;
}

export type ScreenFlashDeathEffect = BaseDeathEffect & DurationDeathEffect & ({
  type: "screenFlash";
  color: string;
  backgroundOnly: boolean;
});

export interface MacroDeathEffect extends BaseDeathEffect {
  type: "macro";
  macro: `Macro.${string}`;
  gmOnly: boolean;
}

export type ScreenShakeDeathEffect = BaseDeathEffect & DurationDeathEffect & EasingDeathEffect & ({
  type: "screenShake";
  strength: number;
  backgroundOnly: boolean;
});

export type FlashDeathEffect = BaseDeathEffect & DurationDeathEffect & ({
  type: "flash";
  color: PIXI.ColorSource;
  replace: boolean;
})

export interface TokenMagicDeathEffect extends BaseDeathEffect {
  type: "tokenMagic";
  tmfxParams: Record<string, unknown>[];
}

export const SlideDirections = ["up", "down", "left", "right"] as const;
export type SlideDirection = typeof SlideDirections[number];

export type SlideDeathEffect = BaseDeathEffect & DurationDeathEffect & EasingDeathEffect & ({
  type: "slide";
  direction: SlideDirection;
  distance: number;
})

export type MeltDeathEffect = BaseDeathEffect & DurationDeathEffect & EasingDeathEffect & ({
  type: "melt"
})

export type DissolveDeathEffect = BaseDeathEffect & DurationDeathEffect & EasingDeathEffect & ({
  type: "dissolve",
  blockSize: number;
})

export type DustDeathEffect = BaseDeathEffect & DurationDeathEffect & EasingDeathEffect & ({
  type: "dust",
  direction: [number, number];
});

export type CrumbleDeathEffect = BaseDeathEffect & DurationDeathEffect & EasingDeathEffect & ({
  type: "crumble",
  floatDistance: number;
  direction: SlideDirection;
});

export interface SpriteAnimationDeathEffect extends BaseDeathEffect {
  animation: string;
  loop: boolean;
  immediate: boolean;
};

export type DeathEffect = BaseDeathEffect | FadeDeathEffect | ShakeDeathEffect | ScreenShakeDeathEffect | MacroDeathEffect | ScreenFlashDeathEffect | StartPlaylistDeathEffect | SoundDeathEffect | TintDeathEffect | TokenMagicDeathEffect | SlideDeathEffect | MeltDeathEffect | DissolveDeathEffect | DustDeathEffect | CrumbleDeathEffect;

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
  checkAutoTriggerActiveEffect(effect: ActiveEffect): void;
  // checkAutoTriggerStatus
  // checkAutoTriggerActiveEffect
}

export interface PresetDefinition {
  name: string;
  description: string;
  preview?: string;
  config: DeathEffectsConfig;
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
