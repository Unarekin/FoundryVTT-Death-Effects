import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, CrumbleDeathEffect } from "types";
import { DefaultCrumbleEffect } from "defaults";
import { templatePath } from "functions";
import { CrumbleConfigContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class CrumbleEffectApplication extends BaseEffectApplication<CrumbleDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.CRUMBLE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/crumble"),
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

  public static async Edit(config?: CrumbleDeathEffect): Promise<CrumbleDeathEffect | undefined> {
    return new CrumbleEffectApplication(config ?? foundry.utils.deepClone(DefaultCrumbleEffect)).Edit();
  }

  protected getDefaultSettings(): CrumbleDeathEffect {
    return foundry.utils.deepClone(DefaultCrumbleEffect);
  }

  async _prepareContext(options: RenderOptions): Promise<CrumbleConfigContext> {
    const context = await super._prepareContext(options) as CrumbleConfigContext;

    context.directionSelect = {
      up: "DEATH-EFFECTS.EFFECTS.COMMON.DIRECTION.UP",
      down: "DEATH-EFFECTS.EFFECTS.COMMON.DIRECTION.DOWN",
      // left: "DEATH-EFFECTS.EFFECTS.COMMON.DIRECTION.LEFT",
      // right: "DEATH-EFFECTS.EFFECTS.COMMON.DIRECTION.RIGHT"
    }

    return context;
  }

}