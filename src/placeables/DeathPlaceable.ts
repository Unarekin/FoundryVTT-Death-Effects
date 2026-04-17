import { DeathEffectsConfig, DeathPlaceable as DeathPlaceableInterface } from "../types";

type Constructor<t> = new (...args: any[]) => t;

export function PlaceableMixin<t extends Constructor<foundry.canvas.placeables.PlaceableObject>>(base: t) {
  abstract class DeathPlaceable extends base implements DeathPlaceableInterface {
    public abstract get deathEffectsConfig(): DeathEffectsConfig;


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    playDeathEffects(config?: DeathEffectsConfig): Promise<void> {
      throw new Error("Method not implemented.");
    }
  }
  return DeathPlaceable;
}