import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, RotateDeathEffect } from "types";
import { DefaultRotateEffect } from "defaults";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class RotateEffectApplication extends BaseEffectApplication<RotateDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.ROTATE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/rotate"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start"),
        templatePath("effects/partials/duration"),
        templatePath("effects/partials/easing")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: RotateDeathEffect): Promise<RotateDeathEffect | undefined> {
    return new RotateEffectApplication(config ?? foundry.utils.deepClone(DefaultRotateEffect)).Edit();
  }

  protected getDefaultSettings(): RotateDeathEffect {
    return foundry.utils.deepClone(DefaultRotateEffect);
  }

}