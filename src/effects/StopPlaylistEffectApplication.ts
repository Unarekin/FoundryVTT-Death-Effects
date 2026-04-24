import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, StopPlaylistDeathEffect } from "types";
import { DefaultStopPlaylistEffect } from "settings";
import { templatePath } from "functions";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class StopPlaylistEffectApplication extends BaseEffectApplication<StopPlaylistDeathEffect> {

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

  public static async Edit(config?: StopPlaylistDeathEffect): Promise<StopPlaylistDeathEffect | undefined> {
    return new StopPlaylistEffectApplication(config ?? foundry.utils.deepClone(DefaultStopPlaylistEffect)).Edit();
  }

  protected getDefaultSettings(): StopPlaylistDeathEffect {
    return foundry.utils.deepClone(DefaultStopPlaylistEffect);
  }

}