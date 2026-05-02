import { ConfigSource, DeathEffectsConfig } from "types";
import { DeathEffectsConfiguration } from "./StandaloneConfig"
import { DefaultDeathEffectsConfig } from "defaults";
import { StandaloneConfigContext } from "./types";

interface ActorUpdate {
  flags?: {
    [__MODULE_ID__]: DeathEffectsConfig;
  },
  prototypeToken: {
    flags: {
      [__MODULE_ID__]: {
        source: ConfigSource,
        config?: DeathEffectsConfig;
      }
    }
  }
}

export class StandalonePrototypeTokenConfig extends DeathEffectsConfiguration {

  protected async _onSave(data: DeathEffectsConfig, source?: ConfigSource) {

    const update: ActorUpdate = {
      prototypeToken: {
        flags: {
          [__MODULE_ID__]: {
            source: source ?? "actorType",
          }
        }
      }
    };

    switch (source) {
      case "actor":
        foundry.utils.setProperty(update, `flags.${__MODULE_ID__}.config`, foundry.utils.deepClone(data));
        break;
      case "token":
        update.prototypeToken.flags[__MODULE_ID__].config = foundry.utils.deepClone(data);
        break;
    }

    console.log("Updating:", update);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.actor.update(update as any);
  }

  protected get actor() { return this.token.actor; }

  protected _getConfigSource(): ConfigSource | undefined {
    return this.token.getFlag(__MODULE_ID__, "source") ?? "actorType";
  }

  protected _getConfigData(): DeathEffectsConfig | undefined {
    const flags = foundry.utils.deepClone(DefaultDeathEffectsConfig);
    const source = this.configSource ?? this._getConfigSource();
    switch (source) {
      case "global":
        foundry.utils.mergeObject(flags, game.settings?.get(__MODULE_ID__, "globalConfig") ?? {});
        break;
      case "actorType": {
        const configs = game.settings?.get(__MODULE_ID__, "actorTypeConfigs");
        if (configs?.[this.actor.type])
          foundry.utils.mergeObject(flags, configs[this.actor.type]);
        break;
      }
      case "actor":
        foundry.utils.mergeObject(flags, this.actor.getFlag(__MODULE_ID__, "config") ?? {});
        break;
      case "token":
        foundry.utils.mergeObject(flags, this.actor.prototypeToken.getFlag(__MODULE_ID__, "config") ?? {});
    }

    console.log("_getConfigData:", this._getConfigSource(), flags);
    return flags;
  }

  async _onRender(context: StandaloneConfigContext, options: foundry.applications.api.ApplicationV2.RenderOptions) {
    await super._onRender(context, options);

    const sourceSelect = this.element.querySelector(`[name="deathEffects.source"]`);
    if (sourceSelect instanceof HTMLSelectElement) {
      this.toggleDeathEffectForm(sourceSelect.value === "token" || sourceSelect.value === "actor");
      sourceSelect.addEventListener("change", () => {
        // this.toggleDeathEffectForm(sourceSelect.value === "token" || sourceSelect.value === "actor");
        this.configSource = sourceSelect.value as ConfigSource;
        this.configCache = undefined;

        this.render().catch(console.error);
      })
    }
  }

  _onChangeForm(formConfig: foundry.applications.api.ApplicationV2.FormConfiguration, e: Event): void {
    super._onChangeForm(formConfig, e);
    const { source } = (foundry.utils.expandObject((new foundry.applications.ux.FormDataExtended(this.element as HTMLFormElement)).object) as { deathEffects: { config: DeathEffectsConfig, source: ConfigSource } }).deathEffects;
    if (source) this.configSource = source;
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

    const actorType = (game.i18n && this.token.actor && CONFIG.Actor.typeLabels[this.token.actor.type]) ? game.i18n.localize(CONFIG.Actor.typeLabels[this.token.actor.type]) : "UNKNOWN";
    context.hasConfigSource = true;

    context.configSourceSelect = {
      token: "DEATH-EFFECTS.CONFIG.SOURCE.TOKEN",
      actor: "DEATH-EFFECTS.CONFIG.SOURCE.ACTOR",
      actorType: game.i18n?.format("DEATH-EFFECTS.CONFIG.SOURCE.TYPE", { type: actorType }) ?? "",
      global: "DEATH-EFFECTS.CONFIG.SOURCE.GLOBAL"
    };

    if (this.actor && CONFIG.Actor.trackableAttributes[this.actor.type]) {
      const trackableAttributes = CONFIG.Actor.trackableAttributes[this.actor.type];
      context.trackableAttributes = [
        ...(trackableAttributes.bar ?? []),
        ...(trackableAttributes.value ?? [])
      ];
    } else {
      context.trackableAttributes = [];
    }

    context.activeEffects = this.actor?.effects.map(effect => effect.name) ?? [];


    return context;
  }

  constructor(protected token: foundry.data.PrototypeToken, options?: foundry.applications.api.ApplicationV2.Configuration) {
    super(options);
  }
}