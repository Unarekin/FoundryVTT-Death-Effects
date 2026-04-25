import { ConfigSource, DeathEffectsConfig } from "types";
import { DeathEffectsConfiguration } from "./StandaloneConfig";
import { DefaultDeathEffectsConfig } from "defaults";
import { StandaloneConfigContext } from "./types";

export class StandaloneTokenConfig extends DeathEffectsConfiguration {

  protected overrideConfigSource: ConfigSource | undefined = undefined;

  protected _getConfigSource(): ConfigSource | undefined {
    return this.token.getFlag(__MODULE_ID__, "source");
  }

  protected async _onSave(data: DeathEffectsConfig): Promise<void> {
    const source = this.overrideConfigSource ?? this._getConfigSource();

    if (!source) throw new Error("No configuration source specified");
    await this.token.setFlag(__MODULE_ID__, "source", source);
    switch (source) {
      case "token":
        await this.token.setFlag(__MODULE_ID__, "config", data);
        break;
      case "actor":
        if (this.token.actor)
          await this.token.actor.setFlag(__MODULE_ID__, "config", data);
        break;
    }
  }
  protected _getConfigData(): DeathEffectsConfig | undefined {
    const source = this.token.getFlag(__MODULE_ID__, "source");
    const flags = foundry.utils.deepClone(DefaultDeathEffectsConfig);
    switch (source) {
      case "token":
        foundry.utils.mergeObject(flags, this.token.getFlag(__MODULE_ID__, "config") ?? {});
        break;
      case "actor":
        if (this.token.actor)
          foundry.utils.mergeObject(flags, this.token.actor.getFlag(__MODULE_ID__, "config") ?? {});
        break;
      case "actorType": {
        if (!this.token.actor) break;
        const configs = game.settings?.get(__MODULE_ID__, "actorTypeConfigs");
        if (configs?.[this.token.actor.type])
          foundry.utils.mergeObject(flags, configs[this.token.actor.type]);
        break;
      }
      case "global":
        foundry.utils.mergeObject(flags, game.settings?.get(__MODULE_ID__, "globalConfig") ?? {});
        break;
    }
    return flags;
  }

  _onChangeForm(formConfig: foundry.applications.api.ApplicationV2.FormConfiguration, e: Event): void {
    super._onChangeForm(formConfig, e);
    const { source } = (foundry.utils.expandObject((new foundry.applications.ux.FormDataExtended(this.element as HTMLFormElement)).object) as { deathEffects: { config: DeathEffectsConfig, source: ConfigSource } }).deathEffects;
    if (source) this.overrideConfigSource = source;
  }

  async _onRender(context: StandaloneConfigContext, options: foundry.applications.api.ApplicationV2.RenderOptions) {
    await super._onRender(context, options);

    const sourceSelect = this.element.querySelector(`[name="deathEffects.source"]`);
    if (sourceSelect instanceof HTMLSelectElement) {
      this.toggleDeathEffectForm(sourceSelect.value === "token" || sourceSelect.value === "actor");
      sourceSelect.addEventListener("change", () => {
        // this.toggleDeathEffectForm(sourceSelect.value === "token" || sourceSelect.value === "actor");
        this.overrideConfigSource = sourceSelect.value as ConfigSource;
        this.configCache = undefined;

        this.render().catch(console.error);
      })
    }
  }

  protected toggleDeathEffectForm(enabled: boolean) {
    const elems = this.element.querySelectorAll(`[data-toggle-death-effects]`);
    for (const elem of elems) {
      if (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement) {
        elem.disabled = !enabled;
      } else if (enabled) {
        elem.removeAttribute("disabled");
        elem.classList.remove("disabled");
      } else {
        elem.setAttribute("disabled", "disabled");
        elem.classList.add("disabled");
      }
    }
  }

  async _prepareContext(options: foundry.applications.api.ApplicationV2.RenderOptions) {
    const context = await super._prepareContext(options);
    context.hasConfigSource = true;

    const actorType = (game.i18n && this.token.actor && CONFIG.Actor.typeLabels[this.token.actor.type]) ? game.i18n.localize(CONFIG.Actor.typeLabels[this.token.actor.type]) : "UNKNOWN";

    context.configSourceSelect = {
      token: "DEATH-EFFECTS.CONFIG.SOURCE.TOKEN",
      actor: "DEATH-EFFECTS.CONFIG.SOURCE.ACTOR",
      actorType: game.i18n?.format("DEATH-EFFECTS.CONFIG.SOURCE.TYPE", { type: actorType }) ?? "",
      global: "DEATH-EFFECTS.CONFIG.SOURCE.GLOBAL"
    };

    if (this.token.actor && CONFIG.Actor.trackableAttributes[this.token.actor.type]) {
      const trackableAttributes = CONFIG.Actor.trackableAttributes[this.token.actor.type];
      context.trackableAttributes = [
        ...(trackableAttributes.bar ?? []),
        ...(trackableAttributes.value ?? [])
      ];
    } else {
      context.trackableAttributes = [];
    }

    context.activeEffects = this.token.actor?.effects.map(effect => effect.name) ?? [];

    context.triggerConditionSelect = [
      { value: "resource", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.RESOURCE.LABEL", disabled: false /* !context.deathEffects.trackableAttributes?.length*/ },
      { value: "status", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.STATUS.LABEL", disabled: false },
      { value: "activeEffect", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.ACTIVEEFFECT.LABEL", disabled: false }
    ]
    context.source = this.overrideConfigSource ?? this._getConfigSource() ?? "actorType";

    return context;
  }

  constructor(protected token: TokenDocument, options?: foundry.applications.api.ApplicationV2.Configuration) {
    super(options);
  }
}