import { DefaultChangeImageEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { ChangeImageDeathEffect, DeathPlaceable } from "types";

export class ChangeImageEffect extends BaseDeathEffect<ChangeImageDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.CHANGEIMAGE.NAME";
  public readonly Name = ChangeImageEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.CHANGEIMAGE.DESCRIPTION";
  public readonly Description = ChangeImageEffect.Description;

  public static readonly Icon = "fa-solid fa-image";
  public readonly Icon = ChangeImageEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Change Image Preview.webm`;
  public readonly Preview = ChangeImageEffect.Preview;

  public execute(placeable: DeathPlaceable): void {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultChangeImageEffect),
      this.config
    );

    if (!config.image) return;

    const mesh = placeable.getDeathSpriteObject() as foundry.canvas.primary.PrimarySpriteMesh | undefined;
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    const texture = PIXI.Texture.from(config.image);
    mesh.texture = texture;
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultChangeImageEffect),
      this.config
    );
    if (config.revertAfterAnimation) {
      const mesh = placeable.getDeathSpriteObject() as foundry.canvas.primary.PrimarySpriteMesh | undefined;
      if (!mesh) throw new Error(`No display object found for ${config.id}`);

      const texture = PIXI.Texture.from((mesh.object as foundry.canvas.placeables.Token).document.texture.src!);
      mesh.texture = texture;

    }

  }

}
