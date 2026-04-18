import { DefaultFadeEffect } from "settings";
import { BaseDeathEffect } from "./BaseEffect";
import { FadeDeathEffect } from "types";

export class FadeEffect extends BaseDeathEffect<FadeDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.FADE.NAME";
  public readonly Name = FadeEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.FADE.DESCRIPTION";
  public readonly Description = FadeEffect.Description;

  public static readonly Icon = "de-icon fade";
  public readonly Icon = FadeEffect.Icon;

  public async execute(placeable: foundry.canvas.placeables.PlaceableObject): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultFadeEffect),
      this.config
    );

    await gsap.to(placeable, { alpha: 0, duration: config.duration / 1000, ease: "none" })
  }

}
