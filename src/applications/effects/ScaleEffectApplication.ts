import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, ScaleDeathEffect } from "types";
import { DefaultScaleEffect } from "defaults";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class ScaleEffectApplication extends BaseEffectApplication<ScaleDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.SCALE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/scale"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start"),
        templatePath("effects/partials/duration"),
        templatePath("effects/partials/easing"),
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: ScaleDeathEffect): Promise<ScaleDeathEffect | undefined> {
    return new ScaleEffectApplication(config ?? foundry.utils.deepClone(DefaultScaleEffect)).Edit();
  }

  protected getDefaultSettings(): ScaleDeathEffect {
    return foundry.utils.deepClone(DefaultScaleEffect);
  }

}