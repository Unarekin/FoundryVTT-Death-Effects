import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, SoundDeathEffect } from "types";
import { DefaultSoundEffect } from "settings";
import { templatePath } from "functions";
import { EffectRenderContext } from "../../effects/types";

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

  _onChangeForm(formConfig: foundry.applications.api.ApplicationV2.FormConfiguration, e: Event): void {
    super._onChangeForm(formConfig, e);

    const data = foundry.utils.expandObject((new foundry.applications.ux.FormDataExtended(this.element as HTMLFormElement)).object) as Record<string, unknown>;
    const preview = this.element.querySelector(`[data-role="audio-preview"]`);
    if (preview instanceof HTMLAudioElement) {
      const url = new URL(data.sound as string ?? "", window.location.href);
      if (preview.src !== url.href) preview.src = data.sound as string ?? "";
      console.log("Volume:", data.volume);
      if (typeof data.volume === "number" && preview.volume !== data.volume / 100)
        preview.volume = data.volume / 100
    }
    //   const url = new URL(data.file as string ?? "", window.location.href);

    //   if (preview.src !== url.href) preview.src = data.file as string ?? "";
    //   const volume = typeof data.volume === "number" ? data.volume / 100 : 1
    //   if (preview.volume !== volume) preview.volume = volume;
    // }

  }

  async _prepareContext(options: RenderOptions): Promise<RenderContext> {
    const context = await super._prepareContext(options)


    context.effect.volume *= 100;

    return context;
  }

  async _onRender(context: RenderContext, options: RenderOptions) {
    await super._onRender(context, options);

    const preview = this.element.querySelector(`[data-role="audio-preview"]`);
    if (preview instanceof HTMLAudioElement) {
      preview.volume = typeof this.config?.volume === "number" ? this.config.volume : 1;
      preview.addEventListener("volumechange", () => {
        const volumeElem = this.element.querySelector(`[name="volume"]`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (volumeElem instanceof HTMLElement && (volumeElem as any).value !== preview.volume * 100)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (volumeElem as any).value = preview.volume * 100;
      })
    }
  }

}