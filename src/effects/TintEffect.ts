import { DefaultFadeEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, TintDeathEffect } from "types";
import { wait } from "functions";

export class TintEffect extends BaseDeathEffect<TintDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.TINT.NAME";
  public readonly Name = TintEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.TINT.DESCRIPTION";
  public readonly Description = TintEffect.Description;

  public static readonly Icon = "fa-solid fa-brush";
  public readonly Icon = TintEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Tint Preview.webm`;
  public readonly Preview = TintEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultFadeEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found for ${config.id}`);

    if (!config.replace) {
      mesh.tint = new PIXI.Color(config.tint).toNumber();
      await wait(config.duration);
      mesh.tint = new PIXI.Color("white").toNumber();
    } else {

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const tintFilter = new (PIXI.filters as any).ColorOverlayFilter() as PIXI.Filter;
      (tintFilter as unknown as Record<string, unknown>).color = new PIXI.Color(config.tint).toRgbArray();

      this.addFilter(mesh, tintFilter);
      await wait(config.duration);
      this.removeFilter(mesh, tintFilter);
    }
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found`);
    mesh.tint = new PIXI.Color("white").toNumber();
  }

}
