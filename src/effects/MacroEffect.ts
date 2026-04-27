import { DefaultMacroEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, MacroDeathEffect } from "types";

export class MacroEffect extends BaseDeathEffect<MacroDeathEffect> {

  public static readonly Name = "DEATH-EFFECTS.EFFECTS.MACRO.NAME";
  public readonly Name = MacroEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.MACRO.DESCRIPTION";
  public readonly Description = MacroEffect.Description;

  public static readonly Icon = "fa-solid fa-code";
  public readonly Icon = MacroEffect.Icon;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultMacroEffect),
      this.config
    );

    if (config.gmOnly && !game.user?.isActiveGM) return;

    const macro = await fromUuid(config.macro);
    if (!(macro instanceof Macro)) throw new Error(`Invalid macro: ${config.macro}`)
    if (!macro.canExecute) throw new Error(`User cannot execute macro: ${macro.name}`);

    await macro.execute({ token: placeable as unknown as Token });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
