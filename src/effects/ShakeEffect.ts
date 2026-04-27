import { DefaultShakeEffect } from "defaults";
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

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Shake Preview.webm`;
  public readonly Preview = ShakeEffect.Preview;

  public async execute(placeable: DeathPlaceable) {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultShakeEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error("No mesh found");

    const tweens: gsap.core.Tween[] = [];

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`

    if (config.horizontal) {
      tweens.push(
        gsap.to(mesh, { x: `+=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease }),
        gsap.to(mesh, { x: `-=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease })
      );
    }
    if (config.vertical) {
      tweens.push(
        gsap.to(mesh, { y: `+=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease }),
        gsap.to(mesh, { y: `-=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease })
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
