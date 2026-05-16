import { DefaultNullEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, NullDeathEffect } from "types";
import { wait } from "functions";

export class NullEffect extends BaseDeathEffect<NullDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.NULL.NAME";
  public readonly Name = NullEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.NULL.DESCRIPTION";
  public readonly Description = NullEffect.Description;

  public static readonly Icon = "fa-solid fa-ban";
  public readonly Icon = NullEffect.Icon;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultNullEffect),
      this.config
    ) as NullDeathEffect;

    await wait(config.duration);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
