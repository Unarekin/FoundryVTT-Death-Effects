import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, MacroDeathEffect } from "types";
import { DefaultMacroEffect } from "settings";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class MacroEffectApplication extends BaseEffectApplication<MacroDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.MACRO.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/macro"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: MacroDeathEffect): Promise<MacroDeathEffect | undefined> {
    return new MacroEffectApplication(config ?? foundry.utils.deepClone(DefaultMacroEffect)).Edit();
  }

  protected getDefaultSettings(): MacroDeathEffect {
    return foundry.utils.deepClone(DefaultMacroEffect);
  }

}