import { DefaultTextureMaskEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, TextureMaskDeathEffect } from "types";

export class TextureMaskEffect extends BaseDeathEffect<TextureMaskDeathEffect> {
  #maskSprite: PIXI.Sprite | undefined = undefined;

  public static readonly Name = "DEATH-EFFECTS.EFFECTS.TEXTUREMASK.NAME";
  public readonly Name = TextureMaskEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.TEXTUREMASK.DESCRIPTION";
  public readonly Description = TextureMaskEffect.Description;

  public static readonly Icon = "fa-solid fa-mask";
  public readonly Icon = TextureMaskEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Texture Mask Preview.webm`;
  public readonly Preview = TextureMaskEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultTextureMaskEffect),
      this.config
    ) as TextureMaskDeathEffect;

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    const texture = PIXI.Texture.from(config.mask);
    const sprite = mesh as foundry.canvas.primary.PrimarySpriteMesh;
    const mask = new PIXI.Sprite(texture);
    this.#maskSprite = mask;

    mask.width = sprite.width;
    mask.height = sprite.height;
    mask.anchor.copyFrom(sprite.anchor);
    mask.x = sprite.x;
    mask.y = sprite.y;

    if (mask.texture.baseTexture.resource instanceof PIXI.VideoResource && game.video) {
      const clonedTexture = await game.video.cloneTexture(mask.texture.baseTexture.resource.source);
      mask.texture = clonedTexture;
    }

    sprite.parent.addChild(mask);
    sprite.mask = mask;
  }


  public teardown(placeable: DeathPlaceable): void {
    if (this.#maskSprite) {
      const config = foundry.utils.mergeObject(
        foundry.utils.deepClone(DefaultTextureMaskEffect),
        this.config
      ) as TextureMaskDeathEffect;

      const mesh = placeable.getDeathSpriteObject();
      if (!mesh) throw new Error(`No display object found for ${config.id}`);
      if (mesh.mask === this.#maskSprite) mesh.mask = null;

      this.#maskSprite.removeFromParent();
      this.#maskSprite.destroy();
      this.#maskSprite = undefined;
    }
  }

}
