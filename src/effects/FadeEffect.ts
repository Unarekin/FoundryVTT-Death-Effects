import { DefaultFadeEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, FadeDeathEffect } from "types";

export class FadeEffect extends BaseDeathEffect<FadeDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.FADE.NAME";
  public readonly Name = FadeEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.FADE.DESCRIPTION";
  public readonly Description = FadeEffect.Description;

  public static readonly Icon = "de-icon de-fade";
  public readonly Icon = FadeEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Fade Preview.webm`;
  public readonly Preview = FadeEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultFadeEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`

    await gsap.to(mesh, { alpha: 0, duration: config.duration / 1000, ease })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
