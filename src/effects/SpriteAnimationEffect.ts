import { DefaultSpriteAnimationEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, SpriteAnimationDeathEffect } from "types";
import { AnimatedPlaceable } from "sprite-animations/types/interfaces";

export class SpriteAnimationEffect extends BaseDeathEffect<SpriteAnimationDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.SPRITEANIMATION.NAME";
  public readonly Name = SpriteAnimationEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.SPRITEANIMATION.DESCRIPTION";
  public readonly Description = SpriteAnimationEffect.Description;

  public static readonly Icon = "fa-solid fa-person-running";
  public readonly Icon = SpriteAnimationEffect.Icon;

  public static readonly Preview: string = "";
  public readonly Preview = SpriteAnimationEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultSpriteAnimationEffect),
      this.config
    );

    const animPlaceable = placeable as unknown as AnimatedPlaceable;
    const animation = foundry.utils.deepClone(animPlaceable.spriteAnimations.find(item => item.name === config.animation));
    if (!animation) return;

    animation.loop = config.loop;

    if (config.immediate)
      await animPlaceable.playLocalAnimation(animation);
    else
      await animPlaceable.queueLocalAnimation(animation);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
