import { DefaultTintEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, TintDeathEffect } from "types";

export class TintEffect extends BaseDeathEffect<TintDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.TINT.NAME";
  public readonly Name = TintEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.TINT.DESCRIPTION";
  public readonly Description = TintEffect.Description;

  public static readonly Icon = "fa-solid fa-brush";
  public readonly Icon = TintEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Tint Preview.webm`;
  public readonly Preview = TintEffect.Preview;

  protected _filters: PIXI.Filter[] = [];

  public execute(placeable: DeathPlaceable) {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultTintEffect),
      this.config
    );


    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found for ${config.id}`);

    if (!config.replace) {
      mesh.tint = new PIXI.Color(config.tint as PIXI.ColorSource).toNumber();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const tintFilter = new (PIXI.filters as any).ColorOverlayFilter() as PIXI.Filter;
      (tintFilter as unknown as Record<string, unknown>).color = new PIXI.Color(config.tint as PIXI.ColorSource).toRgbArray();
      this._filters.push(tintFilter);
      this.addFilter(mesh, tintFilter);
    }
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found`);
    mesh.tint = new PIXI.Color("white").toNumber();
    this._filters.forEach(filter => { this.removeFilter(mesh, filter); })
    this._filters = [];
  }

}
