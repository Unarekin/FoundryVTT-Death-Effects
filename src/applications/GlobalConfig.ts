import { DeathEffectsConfig, DeepPartial } from "types";
import { DeathEffectsConfiguration } from "./StandaloneConfig";

export class GlobalConfig extends DeathEffectsConfiguration {
  static DEFAULT_OPTIONS: DeepPartial<foundry.applications.api.ApplicationV2.Configuration> = {
    window: {
      title: "DEATH-EFFECTS.SETTINGS.MENUS.GLOBAL.LABEL",
    }

  }

  protected async _onSave(data: DeathEffectsConfig) {
    await game.settings?.set(__MODULE_ID__, "globalConfig", data);
  }
  protected _getConfigData(): DeathEffectsConfig | undefined {
    return game.settings?.get(__MODULE_ID__, "globalConfig");
  }
}