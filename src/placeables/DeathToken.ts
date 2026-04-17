import { DeathEffectsConfig } from "types";
import { PlaceableMixin } from "./DeathPlaceable";
import { DefaultDeathEffectsConfig } from "settings";


type Constructor = new (...args: any[]) => foundry.canvas.placeables.Token;

export function TokenMixin(base: Constructor) {
  const tokenClass = class DeathToken extends PlaceableMixin<Constructor>(base) {
    public get deathEffectsConfig(): DeathEffectsConfig {
      return foundry.utils.mergeObject(
        foundry.utils.deepClone(DefaultDeathEffectsConfig),
        (this.document.flags[__MODULE_ID__] ?? {})
      ) as DeathEffectsConfig;
    }

  }
  return tokenClass as unknown as typeof foundry.canvas.placeables.Token;
}