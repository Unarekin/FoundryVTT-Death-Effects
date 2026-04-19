import { DefaultDeathEffectsConfig } from "settings";
import { DeathEffect, DeathEffectsConfig, DeathPlaceable as DeathPlaceableInterface } from "../types";
import { BaseDeathEffect } from "effects";
import { wait } from "functions";

type Constructor<t> = new (...args: any[]) => t;

export function PlaceableMixin<t extends Constructor<foundry.canvas.placeables.PlaceableObject>>(base: t) {
  abstract class DeathPlaceable extends base implements DeathPlaceableInterface {
    public abstract get deathEffectsConfig(): DeathEffectsConfig;

    abstract getDeathSpriteObject(): PIXI.DisplayObject | undefined;

    async playDeathEffects(config?: DeathEffectsConfig): Promise<void> {
      const actualConfig = foundry.utils.mergeObject(
        foundry.utils.deepClone(DefaultDeathEffectsConfig),
        config ?? this.deathEffectsConfig
      );

      // Verify
      for (const effect of actualConfig.effects) {
        const def = CONFIG.DeathEffects.effects[effect.type];
        if (!def?.cls) throw new Error(`Unknown effect type: ${effect.type}`);
      }

      // Run each effect in parallel
      await Promise.all(
        actualConfig.effects.map(async (effectConfig) => {
          const def = CONFIG.DeathEffects.effects[effectConfig.type];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          const effect = new (def as any).cls(effectConfig) as BaseDeathEffect<DeathEffect>;
          if (effect.config?.start)
            await wait(effect.config.start);

          await effect.execute(this);
        })
      )

      if (actualConfig.autoHide) {
        await this.document.update({ hidden: true }, { animate: false });
      } else if (actualConfig.autoTransparent) {
        await this.document.update({ alpha: 0 }, { animate: false });
      }
    }
  }
  return DeathPlaceable;
}