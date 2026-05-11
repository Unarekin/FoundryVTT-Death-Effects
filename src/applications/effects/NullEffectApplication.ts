import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, NullDeathEffect } from "types";
import { DefaultNullEffect } from "defaults";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class NullEffectApplication extends BaseEffectApplication<NullDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.NULL.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/null"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start"),
        templatePath("effects/partials/duration"),
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: NullDeathEffect): Promise<NullDeathEffect | undefined> {
    return new NullEffectApplication(config ?? foundry.utils.deepClone(DefaultNullEffect)).Edit();
  }

  protected getDefaultSettings(): NullDeathEffect {
    return foundry.utils.deepClone(DefaultNullEffect);
  }

}