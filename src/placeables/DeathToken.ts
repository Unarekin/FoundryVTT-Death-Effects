/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeathEffectsConfig, DeepPartial } from "types";
import { PlaceableMixin } from "./DeathPlaceable";
import { DefaultConfigSource, DefaultDeathEffectsConfig } from "defaults";


type Constructor = new (...args: any[]) => foundry.canvas.placeables.Token;

export function TokenMixin(base: Constructor) {
  const tokenClass = class DeathToken extends PlaceableMixin<Constructor>(base) {


    getDeathSpriteObject() { return this.mesh; }

    public get deathEffectsConfig(): DeathEffectsConfig {

      const configSource = (this.document.getFlag(__MODULE_ID__, "source") ?? DefaultConfigSource);
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
      if (this.document.hidden || this.document.alpha === 0) return;
      const config = this.deathEffectsConfig;
      if (config.enabled && config.autoTriggerCondition === "status" && config.statusEffect === status)
        this.playDeathEffects().catch(console.error);
    }

    // protected getResourceValue(actor: Actor, path: string): number | undefined {
    //   const config = this.deathEffectsConfig;
    //   if (config.autoTriggerCondition === "resource") {
    //     let actualPath = "";
    //     if (this.actor && CONFIG.Actor.trackableAttributes[this.actor.type]?.bar.includes(config.resource)) {
    //       actualPath = `system.${config.resource}.value`;
    //     } else if (this.actor && CONFIG.Actor.trackableAttributes[this.actor.type]?.value.includes(config.resource)) {
    //       actualPath = `system.${config.resource}`;
    //     } else if (config.resource.startsWith("system.")) {
    //       actualPath = config.resource;
    //     } else {
    //       actualPath = `system.${config.resource}`;
    //     }
    //     if (actualPath) return foundry.utils.getProperty(actor, actualPath) as number | undefined;
    //   }
    // }

    checkAutoTriggerResource(actor: Actor, delta: Actor.UpdateData) {
      if (!game?.user?.isActiveGM) return;
      if (this.document.hidden || this.document.alpha === 0) return;



      if (this.deathEffectsConfig.autoTriggerCondition === "resource") {
        let value: number | undefined = undefined;
        let comparison: number | undefined = undefined;
        const { resource, comparisonValue, comparisonOperator } = this.deathEffectsConfig;

        const path = resource.startsWith("system.") ? resource : `system.${resource}`;
        const resourceData = foundry.utils.getProperty(actor, path);

        if (!resourceData) return;

        if (typeof resourceData === "number")
          value = resourceData;
        else if (typeof (resourceData as { value: unknown }).value === "number")
          value = (resourceData as { value: number }).value;

        if (typeof value !== "number") return;

        // Determine comparison value
        if (comparisonValue) {
          if (Number.isNumeric(comparisonValue)) {
            comparison = Number(comparisonValue);
          } else if (typeof comparisonValue === "string") {
            const path = comparisonValue.startsWith("system.") ? comparisonValue : `system.${comparisonValue}`;
            const comparisonData = foundry.utils.getProperty(actor, path);
            if (typeof comparisonData === "number") {
              comparison = comparisonData;
            } else if ((comparisonOperator === "gt" || comparisonOperator === "gte") && typeof ((comparisonData as { max: unknown }).max === "number")) {
              comparison = (comparisonData as { max: number }).max;
            } else if ((comparisonOperator === "lt" || comparisonOperator === "lte") && typeof ((comparisonData as { min: unknown }).min === "number")) {
              comparison = (comparisonData as { min: number }).min;
            }
          }
        }

        comparison ??= 0;

        let shouldTrigger = false;
        switch (comparisonOperator) {
          case "gt":
            shouldTrigger = value > comparison;
            break;
          case "gte":
            shouldTrigger = value >= comparison;
            break;
          case "lt":
            shouldTrigger = value < comparison;
            break;
          case "lte":
            shouldTrigger = value <= comparison;
            break;
          case "eq":
            shouldTrigger = value == comparison;
            break;
        }
        if (shouldTrigger)
          this.playDeathEffects().catch(console.error);
      }
    }

    checkAutoTriggerActiveEffect(effect: ActiveEffect) {
      if (!game?.user?.isActiveGM) return;
      if (this.document.hidden || this.document.alpha === 0) return;

      const config = this.deathEffectsConfig;
      if (config.enabled && config.autoTriggerCondition === "activeEffect" && config.activeEffect === effect.name)
        this.playDeathEffects().catch(console.error);
    }

  }
  return tokenClass as unknown as typeof foundry.canvas.placeables.Token;
}