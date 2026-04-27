import { DefaultCrumbleEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, CrumbleDeathEffect } from "types";
import { CrumbleFilter } from "filters";

export class CrumbleEffect extends BaseDeathEffect<CrumbleDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.CRUMBLE.NAME";
  public readonly Name = CrumbleEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.CRUMBLE.DESCRIPTION";
  public readonly Description = CrumbleEffect.Description;

  public static readonly Icon = "de-icon de-crumble";
  public readonly Icon = CrumbleEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Crumble Preview.webm`;
  public readonly Preview = CrumbleEffect.Preview;

  protected _filters: PIXI.Filter[] = [];

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultCrumbleEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found for ${config.id}`);
    if (!mesh.texture) throw new Error("No texture");

    const filter = new CrumbleFilter(config.floatDistance, config.direction, mesh.texture);
    this._filters.push(filter);

    this.addFilter(mesh, filter);

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`
    await gsap.to(filter.uniforms, { progress: 1, duration: config.duration / 1000, ease });
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) return;

    this._filters.forEach(filter => { this.removeFilter(mesh, filter); });
  }

}
