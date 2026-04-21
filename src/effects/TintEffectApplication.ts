import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, TintDeathEffect } from "types";
import { DefaultTintEffect } from "settings";
import { templatePath } from "functions";
import { EffectRenderContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
type RenderContext = EffectRenderContext<TintDeathEffect>;
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class TintEffectApplication extends BaseEffectApplication<TintDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.TINT.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/tint"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: TintDeathEffect): Promise<TintDeathEffect | undefined> {
    return new TintEffectApplication(config ?? foundry.utils.deepClone(DefaultTintEffect)).Edit();
  }

  protected getDefaultSettings(): TintDeathEffect {
    return foundry.utils.deepClone(DefaultTintEffect);
  }

  async _prepareContext(options: RenderOptions): Promise<RenderContext> {
    const context = await super._prepareContext(options)

    context.rootId = foundry.utils.randomID();
    context.effect.tint = new PIXI.Color(context.effect.tint).toHex();

    return context;
  }

}