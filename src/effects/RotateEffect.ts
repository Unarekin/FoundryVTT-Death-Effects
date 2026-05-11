import { DefaultRotateEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, RotateDeathEffect } from "types";

export class RotateEffect extends BaseDeathEffect<RotateDeathEffect> {

  public static readonly Name = "DEATH-EFFECTS.EFFECTS.ROTATE.NAME";
  public readonly Name = RotateEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.ROTATE.DESCRIPTION";
  public readonly Description = RotateEffect.Description;

  public static readonly Icon = "fa-solid fa-rotate";
  public readonly Icon = RotateEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Rotate Preview.webm`;
  public readonly Preview = RotateEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultRotateEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`
    await gsap.to(mesh, { angle: config.angle, duration: config.duration / 1000, ease });
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultRotateEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    mesh.angle -= config.angle;
  }

}
