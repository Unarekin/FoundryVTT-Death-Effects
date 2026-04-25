import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, SlideDeathEffect } from "types";
import { DefaultSlideEffect } from "defaults";
import { templatePath } from "functions";
import { SlideConfigContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class SlideEffectApplication extends BaseEffectApplication<SlideDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.SLIDE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/slide"),
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

  public static async Edit(config?: SlideDeathEffect): Promise<SlideDeathEffect | undefined> {
    return new SlideEffectApplication(config ?? foundry.utils.deepClone(DefaultSlideEffect)).Edit();
  }

  protected getDefaultSettings(): SlideDeathEffect {
    return foundry.utils.deepClone(DefaultSlideEffect);
  }

  async _prepareContext(options: RenderOptions): Promise<SlideConfigContext> {
    const context = await super._prepareContext(options) as SlideConfigContext;

    context.directionSelect = {
      up: "DEATH-EFFECTS.EFFECTS.COMMON.DIRECTION.UP",
      down: "DEATH-EFFECTS.EFFECTS.COMMON.DIRECTION.DOWN",
      left: "DEATH-EFFECTS.EFFECTS.COMMON.DIRECTION.LEFT",
      right: "DEATH-EFFECTS.EFFECTS.COMMON.DIRECTION.RIGHT"
    }

    return context;
  }

}