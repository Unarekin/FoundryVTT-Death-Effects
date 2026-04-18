import { DeathEffect } from "types";

export abstract class BaseEffectApplication<t extends DeathEffect> extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  protected abstract getDefaultSettings(): t;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  public static async Edit(config?: DeathEffect): Promise<DeathEffect | undefined> {
    throw new Error("Not implemented");
  }

  public async Edit(config?: t): Promise<t | undefined> {
    if (config) this.config = config;
    // TODO: Implement

    return Promise.resolve(undefined);
  }

  constructor(public config: t, options?: foundry.applications.api.ApplicationV2.Configuration) {
    super(options);
  }
}

game.DeathEffects ??= { abstract: {}, effects: {} };
game.DeathEffects.abstract ??= {};
game.DeathEffects.abstract.BaseEffectApplication = BaseEffectApplication;