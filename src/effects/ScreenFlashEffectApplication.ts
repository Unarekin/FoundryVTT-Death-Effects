import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, ScreenFlashDeathEffect } from "types";
import { DefaultScreenFlashEffect } from "settings";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class ScreenFlashEffectApplication extends BaseEffectApplication<ScreenFlashDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.SCREENFLASH.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/screenFlash"),
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

  public static async Edit(config?: ScreenFlashDeathEffect): Promise<ScreenFlashDeathEffect | undefined> {
    return new ScreenFlashEffectApplication(config ?? foundry.utils.deepClone(DefaultScreenFlashEffect)).Edit();
  }

  protected getDefaultSettings(): ScreenFlashDeathEffect {
    return foundry.utils.deepClone(DefaultScreenFlashEffect);
  }

  async _prepareContext(options: RenderOptions) {
    const context = await super._prepareContext(options);
    context.fields ??= {};

    context.fields.color = new foundry.data.fields.ColorField({
      label: "DEATH-EFFECTS.EFFECTS.SCREENFLASH.COLOR.LABEL",
      hint: "DEATH-EFFECTS.EFFECTS.SCREENFLASH.COLOR.HINT",
      required: true
    } as any)

    context.fields.backgroundOnly = new foundry.data.fields.BooleanField({
      label: "DEATH-EFFECTS.EFFECTS.SCREENFLASH.BACKGROUNDONLY.LABEL",
      hint: "DEATH-EFFECTS.EFFECTS.SCREENFLASH.BACKGROUNDONLY.HINT",
      required: false
    } as any);

    return context;
  }
}