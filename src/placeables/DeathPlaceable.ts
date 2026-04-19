import { DefaultDeathEffectsConfig } from "settings";
import { DeathEffect, DeathEffectsConfig, DeathPlaceable as DeathPlaceableInterface, DeepPartial } from "../types";
import { BaseDeathEffect } from "effects";
import { wait } from "functions";
import { SendSocketMessage } from "sockets";

type Constructor<t> = new (...args: any[]) => t;

export function PlaceableMixin<t extends Constructor<foundry.canvas.placeables.PlaceableObject>>(base: t) {
  abstract class DeathPlaceable extends base implements DeathPlaceableInterface {

    public abstract get deathEffectsConfig(): DeathEffectsConfig;

    abstract getDeathSpriteObject(): PIXI.DisplayObject | undefined;

    public abstract checkAutoTriggerResource<t extends foundry.abstract.Document.Any = foundry.abstract.Document.Any>(doc: t, delta: DeepPartial<t>): void;


    async playDeathEffects(config?: DeathEffectsConfig, localOnly = false): Promise<void> {
      if (!localOnly) {
        SendSocketMessage({
          type: "play",
          config: config ?? this.deathEffectsConfig,
          target: this.document.id ?? "",
          users: game.users?.filter(user => user.active).map(user => user.id) ?? []
        });
      }

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

          await effect.execute(this as unknown as DeathPlaceableInterface);
        })
      )

      if (!localOnly && game?.user?.isActiveGM) {
        if (actualConfig.autoHide) {
          await this.document.update({ hidden: true }, { animate: false });
        } else if (actualConfig.autoTransparent) {
          await this.document.update({ alpha: 0 }, { animate: false });
        }
      }
    }
  }
  return DeathPlaceable;
}