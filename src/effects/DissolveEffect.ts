import { DefaultDissolveEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, DissolveDeathEffect } from "types";
import { DissolveFilter } from "filters";

export class DissolveEffect extends BaseDeathEffect<DissolveDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.DISSOLVE.NAME";
  public readonly Name = DissolveEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.DISSOLVE.DESCRIPTION";
  public readonly Description = DissolveEffect.Description;

  public static readonly Icon = "de-icon de-dissolve";
  public readonly Icon = DissolveEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/Dissolve Preview.webm`;
  public readonly Preview = DissolveEffect.Preview;

  protected _filters: PIXI.Filter[] = [];


  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultDissolveEffect),
      this.config
    );

    const mesh = placeable.getDeathSpriteObject();
    if (!(mesh instanceof foundry.canvas.primary.PrimarySpriteMesh)) throw new Error(`No display object found for ${config.id}`);
    if (!mesh.texture) throw new Error("No texture");

    const ease = `${config.easing}${config.easingParams ? `(${config.easingParams})` : ``}`


    const filter = new DissolveFilter(1, mesh.texture);
    this._filters.push(filter);
    this.addFilter(mesh, filter);

    await gsap.to(filter.uniforms, { progress: 1, duration: config.duration / 1000, ease });
  }

  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    const mesh = placeable.getDeathSpriteObject();
    if (!mesh) return;
    this._filters.forEach(filter => { this.removeFilter(mesh, filter); });
  }

}
