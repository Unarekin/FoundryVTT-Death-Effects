import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, FlashDeathEffect } from "types";
import { DefaultFlashEffect } from "defaults";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class FlashEffectApplication extends BaseEffectApplication<FlashDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.FLASH.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/flash"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start"),
        templatePath("effects/partials/duration")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: FlashDeathEffect): Promise<FlashDeathEffect | undefined> {
    return new FlashEffectApplication(config ?? foundry.utils.deepClone(DefaultFlashEffect)).Edit();
  }

  protected getDefaultSettings(): FlashDeathEffect {
    return foundry.utils.deepClone(DefaultFlashEffect);
  }

}