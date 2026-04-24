import { DefaultFadeEffect } from "settings";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, TintDeathEffect } from "types";

export class TintEffect extends BaseDeathEffect<TintDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.TINT.NAME";
  public readonly Name = TintEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.TINT.DESCRIPTION";
  public readonly Description = TintEffect.Description;

  public static readonly Icon = "fa-solid fa-brush";
  public readonly Icon = TintEffect.Icon;

  public execute(placeable: DeathPlaceable): void {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultFadeEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found for ${config.id}`);
    mesh.tint = new PIXI.Color(config.tint).toNumber();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
