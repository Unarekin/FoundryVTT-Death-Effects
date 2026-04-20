/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeathEffectsConfig, DeepPartial } from "types";
import { PlaceableMixin } from "./DeathPlaceable";
import { DefaultDeathEffectsConfig } from "settings";


type Constructor = new (...args: any[]) => foundry.canvas.placeables.Token;

export function TokenMixin(base: Constructor) {
  const tokenClass = class DeathToken extends PlaceableMixin<Constructor>(base) {


    getDeathSpriteObject() { return this.mesh; }

    public get deathEffectsConfig(): DeathEffectsConfig {

      const configSource = (this.document.getFlag(__MODULE_ID__, "source") ?? "actor");
      const globalConfig = game.settings?.settings?.get(`${__MODULE_ID__}.globalConfig`) ? game.settings.get(__MODULE_ID__, "globalConfig") : undefined;
      const actorTypeConfigs = game.settings?.settings?.get(`${__MODULE_ID__}.actorTypeConfigs`) ? game.settings.get(__MODULE_ID__, "actorTypeConfigs") : undefined;


      let flags: DeepPartial<DeathEffectsConfig> | undefined = undefined;
      switch (configSource) {
        case "actor":
          flags = foundry.utils.deepClone(this.document.actor?.getFlag(__MODULE_ID__, "config"));
          break;
        case "token":
          flags = foundry.utils.deepClone(this.document.getFlag(__MODULE_ID__, "config"));
          break;
        case "actorType":
          if (this.document?.actor && actorTypeConfigs?.[this.document.actor.type])
            flags = foundry.utils.deepClone(actorTypeConfigs[this.document.actor.type]);
          break;
        case "global":
          if (globalConfig)
            flags = foundry.utils.deepClone(globalConfig);
          break;
      }

      const actualConfig = foundry.utils.deepClone(DefaultDeathEffectsConfig);
      if (flags) foundry.utils.mergeObject(actualConfig, flags);
      return actualConfig;
    }

    checkAutoTriggerStatus(status: string) {
      if (!game?.user?.isActiveGM) return;
      const config = this.deathEffectsConfig;
      if (config.enabled && config.autoTriggerCondition === "status" && config.statusEffect === status)
        this.playDeathEffects().catch(console.error);
    }

    checkAutoTriggerResource<Actor>(actor: Actor, delta: DeepPartial<Actor>) {
      if (!game?.user?.isActiveGM) return;

      //public abstract checkAutoTriggerResource<t extends foundry.abstract.Document.Any = foundry.abstract.Document.Any>(doc: t, delta: DeepPartial<t>): void;
      const config = this.deathEffectsConfig;
      console.log("Config:", config);
      if (config.enabled && config.autoTriggerCondition === "resource" && config.resource) {
        let actualPath = "";
        if (this.actor && CONFIG.Actor.trackableAttributes[this.actor.type]?.bar.includes(config.resource)) {
          actualPath = `system.${config.resource}.value`;
        } else if (this.actor && CONFIG.Actor.trackableAttributes[this.actor.type]?.value.includes(config.resource)) {
          actualPath = `system.${config.resource}`;
        } else if (config.resource.startsWith("system.")) {
          actualPath = config.resource;
        } else {
          actualPath = `system.${config.resource}`;
        }

        console.log("Actual resource path:", actualPath);

        if (actualPath) {
          // const actualPath = config.resource.startsWith("system.") ? config.resource : `system.${config.resource}.value`;
          const val = foundry.utils.getProperty(actor as Record<string, unknown>, actualPath);
          if (val === 0)
            this.playDeathEffects().catch(console.error);

        }

      }
    }

    checkAutoTriggerActiveEffect(effect: ActiveEffect) {
      if (!game?.user?.isActiveGM) return;
      const config = this.deathEffectsConfig;
      if (config.enabled && config.autoTriggerCondition === "activeEffect" && config.activeEffect === effect.name)
        this.playDeathEffects().catch(console.error);
    }

  }
  return tokenClass as unknown as typeof foundry.canvas.placeables.Token;
}