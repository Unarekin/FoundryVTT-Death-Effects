import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, DissolveDeathEffect } from "types";
import { DefaultDissolveEffect } from "defaults";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class DissolveEffectApplication extends BaseEffectApplication<DissolveDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.DISSOLVE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/dissolve"),
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

  public static async Edit(config?: DissolveDeathEffect): Promise<DissolveDeathEffect | undefined> {
    return new DissolveEffectApplication(config ?? foundry.utils.deepClone(DefaultDissolveEffect)).Edit();
  }

  protected getDefaultSettings(): DissolveDeathEffect {
    return foundry.utils.deepClone(DefaultDissolveEffect);
  }

}