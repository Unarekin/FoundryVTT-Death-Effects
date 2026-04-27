import { DefaultMeltEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, MeltDeathEffect } from "types";
import { MeltFilter } from "filters";

export class MeltEffect extends BaseDeathEffect<MeltDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.MELT.NAME";
  public readonly Name = MeltEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.MELT.DESCRIPTION";
  public readonly Description = MeltEffect.Description;

  public static readonly Icon = "de-icon de-melt";
  public readonly Icon = MeltEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Melt Preview.webm`;
  public readonly Preview = MeltEffect.Preview;

  protected _filters: MeltFilter[] = [];

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultMeltEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${config.id}`);

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`

    const filter = new MeltFilter();
    this._filters.push(filter);

    this.addFilter(mesh, filter);

    await gsap.to(filter.uniforms, { progress: 1, duration: config.duration / 1000, ease });
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) throw new Error(`No display object found for ${this.config?.id}`);
    for (const filter of this._filters)
      this.removeFilter(mesh, filter);
  }

}
