import { DefaultDustEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, DustDeathEffect } from "types";
import { DustFilter } from "filters";

export class DustEffect extends BaseDeathEffect<DustDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.DUST.NAME";
  public readonly Name = DustEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.DUST.DESCRIPTION";
  public readonly Description = DustEffect.Description;

  public static readonly Icon = "de-icon de-dust";
  public readonly Icon = DustEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Dust Preview.webm`;
  public readonly Preview = DustEffect.Preview;

  protected _filters: PIXI.Filter[] = [];

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultDustEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`

    const filter = new DustFilter(config.direction);
    this._filters.push(filter);
    this.addFilter(mesh, filter);
    await gsap.to(filter.uniforms, { progress: 1, duration: config.duration / 1000, ease });
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${this.config?.id ?? ""}`);
    this._filters.forEach(filter => { this.removeFilter(mesh, filter); });
  }

}
