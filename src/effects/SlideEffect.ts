import { DefaultSlideEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, SlideDeathEffect } from "types";

export class SlideEffect extends BaseDeathEffect<SlideDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.SLIDE.NAME";
  public readonly Name = SlideEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.SLIDE.DESCRIPTION";
  public readonly Description = SlideEffect.Description;

  public static readonly Icon = "fa-solid fa-arrow-down";
  public readonly Icon = SlideEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Slide Preview.webm`;
  public readonly Preview = SlideEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultSlideEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    const anim: { x?: number | string, y?: number | string } = {}

    switch (config.direction) {
      case "up":
        anim.y = `-=${config.distance}`;
        break;
      case "down":
        anim.y = `+=${config.distance}`;
        break;
      case "left":
        anim.x = `-=${config.distance}`;
        break;
      case "right":
        anim.x = `+=${config.distance}`;
    }

    if (!Object.keys(anim).length) throw new Error("No distance calculated");

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`

    await gsap.to(mesh, { ...anim, duration: config.duration / 1000, ease });
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
    if (!this.config) return;

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${this.config.id}`);

    switch (this.config.direction) {
      case "up":
        mesh.y += this.config.distance;
        break;
      case "down":
        mesh.y -= this.config.distance;
        break;
      case "left":
        mesh.x += this.config.distance;
        break;
      case "right":
        mesh.x -= this.config.distance;
        break;
    }
  }

}
