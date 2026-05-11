import { DefaultScaleEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, ScaleDeathEffect } from "types";

export class ScaleEffect extends BaseDeathEffect<ScaleDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.SCALE.NAME";
  public readonly Name = ScaleEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.SCALE.DESCRIPTION";
  public readonly Description = ScaleEffect.Description;

  public static readonly Icon = "fa-solid fa-window-restore";
  public readonly Icon = ScaleEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Scale Preview.webm`;
  public readonly Preview = ScaleEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultScaleEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`
    await gsap.to(mesh.scale, { x: mesh.scale.x * config.scale.x, y: mesh.scale.y * config.scale.y, duration: config.duration / 1000, ease })
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultScaleEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    // Multiply by the inverse of the current scale to undo this scale effect
    mesh.scale.set(
      mesh.scale.x * (1 / config.scale.x),
      mesh.scale.y * (1 / config.scale.y)
    );
  }

}
