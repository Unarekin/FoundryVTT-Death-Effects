import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, SoundDeathEffect } from "types";
import { DefaultSoundEffect } from "settings";
import { templatePath } from "functions";
import { EffectRenderContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
type RenderContext = EffectRenderContext<SoundDeathEffect>;
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class SoundEffectApplication extends BaseEffectApplication<SoundDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.SOUND.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/sound"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: SoundDeathEffect): Promise<SoundDeathEffect | undefined> {
    return new SoundEffectApplication(config ?? foundry.utils.deepClone(DefaultSoundEffect)).Edit();
  }

  protected parseFormFields(): SoundDeathEffect {
    const effect = super.parseFormFields();
    effect.volume /= 100;
    return effect;
  }

  protected getDefaultSettings(): SoundDeathEffect {
    return foundry.utils.deepClone(DefaultSoundEffect);
  }

  async _prepareContext(options: RenderOptions): Promise<RenderContext> {
    const context = await super._prepareContext(options)


    context.effect.volume *= 100;

    return context;
  }

}