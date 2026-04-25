import { DefaultScreenShakeEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, ScreenShakeDeathEffect } from "types";
import { wait } from "functions";

export class ScreenShakeEffect extends BaseDeathEffect<ScreenShakeDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.SCREENSHAKE.NAME";
  public readonly Name = ScreenShakeEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.SCREENSHAKE.DESCRIPTION";
  public readonly Description = ScreenShakeEffect.Description;

  public static readonly Icon = "fa-solid fa-arrow-right-arrow-left";
  public readonly Icon = ScreenShakeEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Screen Shake Preview.webm`;
  public readonly Preview = ScreenShakeEffect.Preview;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultScreenShakeEffect),
      this.config
    );

    // const mesh = placeable.getDeathSpriteObject();

    const meshes: PIXI.DisplayObject[] = [];

    if (game.release?.isNewer("14")) {
      meshes.push(...(canvas?.primary?.children.filter(child => child.name && child.name.startsWith(`Level.`) && (child.name.endsWith(`.background`) || child.name.endsWith(`.foreground`))) ?? []))
    } else {
      const mesh = config.backgroundOnly ? canvas?.primary?.background : canvas?.primary;
      if (!mesh) throw new Error(`No display object found for ${config.id}`);
      meshes.push(mesh);
    }


    const tweens = meshes.map(mesh => gsap.to(mesh, { x: `+=${config.strength}`, duration: .01, yoyo: true, repeat: -1, ease: config.easing ?? "none" }));

    await wait(config.duration);
    tweens.forEach(tween => { tween.kill(); });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
