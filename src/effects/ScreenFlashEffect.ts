import { DefaultScreenFlashEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, ScreenFlashDeathEffect } from "types";
import { wait } from "functions";

export class ScreenFlashEffect extends BaseDeathEffect<ScreenFlashDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.SCREENFLASH.NAME";
  public readonly Name = ScreenFlashEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.SCREENFLASH.DESCRIPTION";
  public readonly Description = ScreenFlashEffect.Description;

  public static readonly Icon = "de-icon flash";
  public readonly Icon = ScreenFlashEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Screen Flash Preview.webm`;
  public readonly Preview = ScreenFlashEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    if (!canvas?.stage || !canvas?.scene || !canvas?.primary) return;


    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultScreenFlashEffect),
      this.config
    );

    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.tint = config.color;


    if (config.backgroundOnly) {
      const { sceneRect } = canvas.scene.dimensions;
      sprite.width = sceneRect.x + sceneRect.width + sceneRect.x;
      sprite.height = sceneRect.y + sceneRect.height + sceneRect.y;

      if (game.release?.isNewer("14")) {
        // Handle v14 scene levels
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const levelId = (placeable as any).document.level as string;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const level = (canvas.scene as any).levels.contents.find((level: any) => level.id === levelId) as Record<string, unknown>;
        const spriteName = `Level.${level.index as number}.background`;
        const bgSprite = canvas.primary?.getChildByName(spriteName);
        if (!bgSprite) throw new Error("Level background sprite not found");
        canvas.primary.addChildAt(sprite, canvas.primary.children.indexOf(bgSprite) + 1);
        sprite.zIndex = 0;
      } else {
        const background = canvas.primary.background;
        if (!background) throw new Error("Background sprite not found");
        sprite.zIndex = 0;
        canvas.primary.addChildAt(sprite, canvas.primary.children.indexOf(background) + 1);
      }

    } else {
      sprite.width = window.innerWidth;
      sprite.height = window.innerHeight;
      canvas.overlay.addChild(sprite);
    }

    await wait(config.duration);
    sprite.destroy();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }
}
