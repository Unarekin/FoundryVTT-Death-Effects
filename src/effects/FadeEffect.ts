import { BaseDeathEffect } from "./BaseEffect";
import { FadeDeathEffect } from "types";

export class FadeEffect extends BaseDeathEffect<FadeDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.FADE.NAME";
  public readonly Name = FadeEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.FADE.DESCRIPTION";
  public readonly Description = FadeEffect.Description;

  public static readonly Icon = "de-icon fade";
  public readonly Icon = FadeEffect.Icon;

  public execute(): Promise<void> {
    throw new Error("Method not implemented.");
  }

}
