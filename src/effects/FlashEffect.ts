import { DefaultFlashEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, FlashDeathEffect } from "types";
import { wait } from "functions";

export class FlashEffect extends BaseDeathEffect<FlashDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.FLASH.NAME";
  public readonly Name = FlashEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.FLASH.DESCRIPTION";
  public readonly Description = FlashEffect.Description;

  public static readonly Icon = "de-icon flash";
  public readonly Icon = FlashEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Flash Preview.webm`;
  public readonly Preview = FlashEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultFlashEffect),
      this.config
    ) as FlashDeathEffect;


    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found for ${config.id}`);

    if (!config.replace) {
      mesh.tint = new PIXI.Color(config.color).toNumber();
      await wait(config.duration);
      mesh.tint = new PIXI.Color("white").toNumber();
    } else {

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const tintFilter = new (PIXI.filters as any).ColorOverlayFilter() as PIXI.Filter;
      (tintFilter as unknown as Record<string, unknown>).color = new PIXI.Color(config.color).toRgbArray();

      this.addFilter(mesh, tintFilter);
      await wait(config.duration);
      this.removeFilter(mesh, tintFilter);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
