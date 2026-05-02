import { ConfigSource, DeathEffectsConfig } from "types";
import { DeathEffectsConfiguration } from "./StandaloneConfig"
import { DefaultDeathEffectsConfig } from "defaults";
export class ActorTypeConfig extends DeathEffectsConfiguration {

  protected _getConfigSource(): ConfigSource | undefined { return undefined; }

  protected async _onSave(data: DeathEffectsConfig): Promise<void> {
    if (!game.settings) return;
    const actorFlags = game.settings.get(__MODULE_ID__, "actorTypeConfigs") ?? {};
    actorFlags[this.actorType] = data;
    await game.settings.set(__MODULE_ID__, "actorTypeConfigs", actorFlags);
  }
  protected _getConfigData(): DeathEffectsConfig | undefined {
    const flags = foundry.utils.deepClone(DefaultDeathEffectsConfig);
    const actorFlags = game.settings?.get(__MODULE_ID__, "actorTypeConfigs");
    if (actorFlags?.[this.actorType])
      foundry.utils.mergeObject(flags, actorFlags[this.actorType]);

    return flags;
  }

  constructor(protected actorType: string, options?: foundry.applications.api.ApplicationV2.Configuration) {
    super(options);
  }
}