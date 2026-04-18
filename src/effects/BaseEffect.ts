import { DeathEffect } from "types";
import { BaseEffectApplication } from "./BaseEffectApplication";

export abstract class BaseDeathEffect<t extends DeathEffect> {
  public static get Name(): string { throw new Error("Not implemented"); }
  public abstract get Name(): string;

  public static get appClass(): BaseEffectApplication<any> { throw new Error("Not implemented"); }

  public abstract execute(): Promise<void>;



  constructor(public config?: t) { }
}

game.DeathEffects ??= { abstract: {}, effects: {} };
game.DeathEffects.abstract ??= {};
game.DeathEffects.abstract.BaseDeathEffect = BaseDeathEffect;