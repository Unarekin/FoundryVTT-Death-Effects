import { DefaultOverlayImageEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, OverlayImageDeathEffect } from "types";

export class OverlayImageEffect extends BaseDeathEffect<OverlayImageDeathEffect> {
  #effect: PIXI.Sprite | undefined = undefined;

  public static readonly Name = "DEATH-EFFECTS.EFFECTS.OVERLAYIMAGE.NAME";
  public readonly Name = OverlayImageEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.OVERLAYIMAGE.DESCRIPTION";
  public readonly Description = OverlayImageEffect.Description;

  public static readonly Icon = "fa-solid fa-image";
  public readonly Icon = OverlayImageEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Overlay Image Preview.webm`;
  public readonly Preview = OverlayImageEffect.Preview;

  public static async getDuration(config: OverlayImageDeathEffect): Promise<number> {
    if (!config.image) return 0;
    if (!foundry.helpers.media.VideoHelper.hasVideoExtension(config.image)) return 0;

    return new Promise<number>((resolve, reject) => {
      const video = document.createElement("video");
      video.addEventListener("loadedmetadata", () => {
        resolve(video.duration * 1000);
      });
      video.addEventListener("error", (err: ErrorEvent) => {
        reject(err.error as Error);
      });

      video.src = config.image;
    })

  }

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultOverlayImageEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found for ${config.id}`);

    const texture = PIXI.Texture.from(config.image);

    const sprite = new PIXI.Sprite(texture);
    this.#effect = sprite;

    if (sprite.texture.baseTexture.resource instanceof PIXI.VideoResource && game.video) {
      const clonedTexture = await game.video.cloneTexture(sprite.texture.baseTexture.resource.source);
      sprite.texture = clonedTexture;
    }

    mesh.addChild(sprite);

    if (config.relativeSize) {
      const scaleX = (mesh.texture ?? mesh).width / sprite.texture.width;
      const scaleY = (mesh.texture ?? mesh).height / sprite.texture.height;
      const scale = Math.max(scaleX, scaleY);
      sprite.scale.set(scale);
    }

    if (config.sizeMode === "size" && config.relativeSize) {
      sprite.width += config.size.width;
      sprite.height += config.size.height;
    } else if (config.sizeMode === "size") {
      sprite.width = config.size.width;
      sprite.height = config.size.height;
    } else if (config.sizeMode === "scale") {
      sprite.scale.x *= config.scale.x;
      sprite.scale.y *= config.scale.y;
    }

    sprite.alpha = config.alpha;
    sprite.angle = config.angle;

    sprite.anchor.set(0.5, 0.5);

    sprite.x = (mesh.width * config.anchor.x) - (mesh.width * mesh.anchor.x);
    sprite.y = (mesh.height * config.anchor.y) - (mesh.height * mesh.anchor.y);

    return new Promise(resolve => {
      if (sprite.texture.baseTexture.resource instanceof PIXI.VideoResource) {
        sprite.texture.baseTexture.resource.source.addEventListener("ended", () => { resolve(); }, { once: true });
      } else {
        resolve();
      }
    })

  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    if (this.#effect) {
      if (Array.isArray(this.#effect.filters)) {
        const filters = [...this.#effect.filters];
        this.#effect.filters = [];
        filters.forEach(filter => filter.destroy());
      }
      this.#effect.destroy();
      this.#effect = undefined;
    }
  }
}
