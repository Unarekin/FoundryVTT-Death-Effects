import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, TokenMagicDeathEffect } from "types";
import { DefaultTokenMagicEffect } from "defaults";
import { templatePath } from "functions";
import { TMFXConfigContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class TokenMagicEffectApplication extends BaseEffectApplication<TokenMagicDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.TOKENMAGIC.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/tokenMagic"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start"),
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: TokenMagicDeathEffect): Promise<TokenMagicDeathEffect | undefined> {
    return new TokenMagicEffectApplication(config ?? foundry.utils.deepClone(DefaultTokenMagicEffect)).Edit();
  }

  protected parseFormFields(): TokenMagicDeathEffect {
    const effect = super.parseFormFields();
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-base-to-string
      const params = (new Function("return " + effect.tmfxParams as string))() as Record<string, unknown>[];;
      if (!Array.isArray(params)) throw new Error(`Parameters do not appear to be properly formed`);
      effect.tmfxParams = params;
    } catch {
      effect.tmfxParams = [];
    }

    return effect;
  }

  protected getDefaultSettings(): TokenMagicDeathEffect {
    return foundry.utils.deepClone(DefaultTokenMagicEffect);
  }

  async _prepareContext(options: RenderOptions): Promise<TMFXConfigContext> {
    const context = await super._prepareContext(options) as TMFXConfigContext
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (context.effect as any).tmfxParams = JSON.stringify(context.effect.tmfxParams, null, 2);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    context.tmfxPresets = TokenMagic.getPresets().map((preset: { name: string; }) => preset.name);
    return context;
  }

  async _onRender(context: TMFXConfigContext, options: RenderOptions) {
    await super._onRender(context, options);

    const presetSelect = this.element.querySelector(`[data-role="tmfx-preset"]`);
    if (presetSelect instanceof HTMLInputElement) {
      presetSelect.addEventListener("change", () => {
        const presetId = presetSelect.value;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const preset = (TokenMagic.getPresets() as Record<string, unknown>[]).find(item => item.name === presetId);
        if (preset) {
          this.config.tmfxParams = foundry.utils.deepClone(preset.params) as Record<string, unknown>[];
          this.render().catch(console.error);
          presetSelect.value = "";
        }
      })

    }
  }

}