import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, ScreenShakeDeathEffect } from "types";
import { DefaultScreenShakeEffect } from "defaults";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class ScreenShakeEffectApplication extends BaseEffectApplication<ScreenShakeDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.SCREENSHAKE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/screenShake"),
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

  public static async Edit(config?: ScreenShakeDeathEffect): Promise<ScreenShakeDeathEffect | undefined> {
    return new ScreenShakeEffectApplication(config ?? foundry.utils.deepClone(DefaultScreenShakeEffect)).Edit();
  }

  protected getDefaultSettings(): ScreenShakeDeathEffect {
    return foundry.utils.deepClone(DefaultScreenShakeEffect);
  }

}