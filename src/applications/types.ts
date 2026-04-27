import { AutoTriggerCondition, ConfigSource, DeathEffect, DeathEffectsConfig, PresetDefinition } from "types";

export type DeathEffectContext = DeathEffect & ({
  actualLabel: string;
  editableDuration: boolean;
})

export interface TimelineContext extends foundry.applications.api.ApplicationV2.RenderContext {
  rootId: string;
  effects: DeathEffectContext[];
  buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
}

export interface DeathEffectsConfigContext {
  config: DeathEffectsConfig,
  source: ConfigSource;
  hasConfigSource: boolean;
  configSourceSelect: Partial<Record<ConfigSource, string>>;
  hasTriggerConditions: boolean;
  triggerConditionSelect?: { value: AutoTriggerCondition, label: string, disabled: boolean }[];
  statusEffects?: Record<string, string>;
  activeEffects: string[];
  trackableAttributes?: string[];
}

export interface StandaloneConfigContext extends DeathEffectsConfigContext {
  rootId: string;
  buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
}

export interface PlaceableConfigContext<t extends foundry.abstract.Document.Any> extends foundry.applications.api.DocumentSheetV2.RenderContext<t> {
  deathEffects: DeathEffectsConfigContext;
}
export interface ActorTypeSelectionContext extends foundry.applications.api.ApplicationV2.RenderContext {
  types: { value: string, label: string }[];
  buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
}

export interface PresetSelectionContext extends foundry.applications.api.ApplicationV2.RenderContext {
  presets: Record<string, PresetDefinition>;
}