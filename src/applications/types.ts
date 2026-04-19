import { AutoTriggerCondition, ConfigSource, DeathEffect, DeathEffectsConfig } from "types";

type DeathEffectContext = DeathEffect & ({
  actualLabel: string;
})

export interface TimelineContext extends foundry.applications.api.ApplicationV2.RenderContext {
  rootId: string;
  effects: DeathEffectContext[];
  buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
}

export interface PlaceableConfigContext<t extends foundry.abstract.Document.Any> extends foundry.applications.api.DocumentSheetV2.RenderContext<t> {
  deathEffects: {
    config: DeathEffectsConfig,
    source: ConfigSource;
    configSourceSelect: Partial<Record<ConfigSource, string>>;
    hasTriggerConditions: boolean;
    triggerConditionSelect?: { value: AutoTriggerCondition, label: string, disabled: boolean }[];
    statusEffects?: Record<string, string>;
    trackableAttributes?: string[];
  };
}