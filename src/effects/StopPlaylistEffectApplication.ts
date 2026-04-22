import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, FadeDeathEffect } from "types";
import { DefaultFadeEffect } from "settings";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class StopPlaylistEffectApplication extends BaseEffectApplication<FadeDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.STOPPLAYLIST.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/stopPlaylist"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: FadeDeathEffect): Promise<FadeDeathEffect | undefined> {
    return new StopPlaylistEffectApplication(config ?? foundry.utils.deepClone(DefaultFadeEffect)).Edit();
  }

  protected getDefaultSettings(): FadeDeathEffect {
    return foundry.utils.deepClone(DefaultFadeEffect);
  }

}