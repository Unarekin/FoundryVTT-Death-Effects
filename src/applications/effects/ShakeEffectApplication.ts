import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, ShakeDeathEffect } from "types";
import { DefaultShakeEffect } from "defaults";
import { templatePath } from "functions";
import { EffectRenderContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
type RenderContext = EffectRenderContext<ShakeDeathEffect>;
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class ShakeEffectApplication extends BaseEffectApplication<ShakeDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.SHAKE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/shake"),
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

  public static async Edit(config?: ShakeDeathEffect): Promise<ShakeDeathEffect | undefined> {
    return new ShakeEffectApplication(config ?? foundry.utils.deepClone(DefaultShakeEffect)).Edit();
  }

  protected getDefaultSettings(): ShakeDeathEffect {
    return foundry.utils.deepClone(DefaultShakeEffect);
  }

  async _prepareContext(options: RenderOptions): Promise<RenderContext> {
    const context = await super._prepareContext(options)

    context.rootId = foundry.utils.randomID();

    return context;
  }

}