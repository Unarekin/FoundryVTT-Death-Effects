import { DefaultShakeEffect } from "settings";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, ShakeDeathEffect } from "types";
import { wait } from "functions";

export class ShakeEffect extends BaseDeathEffect<ShakeDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.SHAKE.NAME";
  public readonly Name = ShakeEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.SHAKE.DESCRIPTION";
  public readonly Description = ShakeEffect.Description;

  public static readonly Icon = "fa-solid fa-arrow-right-arrow-left";
  public readonly Icon = ShakeEffect.Icon;

  public async execute(placeable: DeathPlaceable) {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultShakeEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error("No mesh found");

    const tweens: gsap.core.Tween[] = [];

    if (config.horizontal) {
      tweens.push(
        gsap.to(mesh, { x: `+=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease: config.easing ?? "none" }),
        gsap.to(mesh, { x: `-=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease: config.easing ?? "none" })
      );
    }
    if (config.vertical) {
      tweens.push(
        gsap.to(mesh, { y: `+=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease: config.easing ?? "none" }),
        gsap.to(mesh, { y: `-=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease: config.easing ?? "none" })
      );
    }

    await wait(config.duration);
    tweens.forEach(tween => { tween.kill(); });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
