import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, OverlayImageDeathEffect, SizeMode } from "types";
import { DefaultOverlayImageEffect } from "defaults";
import { expandFormData, templatePath } from "functions";
import { OverlayImageConfigContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
type RenderContext = OverlayImageConfigContext;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class OverlayImageEffectApplication extends BaseEffectApplication<OverlayImageDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.OVERLAYIMAGE.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/overlayImage"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start"),
        templatePath("effects/partials/alpha"),
        templatePath("effects/partials/angle")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: OverlayImageDeathEffect): Promise<OverlayImageDeathEffect | undefined> {
    return new OverlayImageEffectApplication(config ?? foundry.utils.deepClone(DefaultOverlayImageEffect)).Edit();
  }

  protected getDefaultSettings(): OverlayImageDeathEffect {
    return foundry.utils.deepClone(DefaultOverlayImageEffect);
  }

  _onChangeForm(formConfig: foundry.applications.api.ApplicationV2.FormConfiguration, e: Event): void {
    super._onChangeForm(formConfig, e);

    const data = expandFormData(this.element as HTMLFormElement);
    if (data.sizeMode)
      this.setSizeMode(data.sizeMode as SizeMode);
  }

  protected setSizeMode(mode: SizeMode) {
    const elements: HTMLElement[] = Array.from(this.element.querySelectorAll(`[data-role="sizeMode"]`));
    for (const elem of elements) {
      elem.style.display = elem.dataset.sizeMode === mode ? "block" : "none";
    }
  }

  async _prepareContext(options: RenderOptions): Promise<RenderContext> {
    const context = await super._prepareContext(options) as RenderContext;

    context.sizeModeOptions = {
      "size": "DEATH-EFFECTS.EFFECTS.OVERLAYIMAGE.SIZE.LABEL",
      "scale": "DEATH-EFFECTS.EFFECTS.OVERLAYIMAGE.SCALE.LABEL"
    }

    return context;
  }

}