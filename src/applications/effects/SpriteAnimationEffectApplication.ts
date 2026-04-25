import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, SpriteAnimationDeathEffect } from "types";
import { DefaultSpriteAnimationEffect } from "defaults";
import { templatePath } from "functions";
import { EffectRenderContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class SpriteAnimationEffectApplication extends BaseEffectApplication<SpriteAnimationDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.SPRITEANIMATION.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/spriteAnimation"),
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

  public static async Edit(config?: SpriteAnimationDeathEffect): Promise<SpriteAnimationDeathEffect | undefined> {
    return new SpriteAnimationEffectApplication(config ?? foundry.utils.deepClone(DefaultSpriteAnimationEffect)).Edit();
  }

  protected getDefaultSettings(): SpriteAnimationDeathEffect {
    return foundry.utils.deepClone(DefaultSpriteAnimationEffect);
  }
}