import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, ChangeImageDeathEffect } from "types";
import { DefaultChangeImageEffect } from "defaults";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class ChangeImageEffectApplication extends BaseEffectApplication<ChangeImageDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.CHANGEIMAGE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/changeImage"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: ChangeImageDeathEffect): Promise<ChangeImageDeathEffect | undefined> {
    return new ChangeImageEffectApplication(config ?? foundry.utils.deepClone(DefaultChangeImageEffect)).Edit();
  }

  protected getDefaultSettings(): ChangeImageDeathEffect {
    return foundry.utils.deepClone(DefaultChangeImageEffect);
  }

}