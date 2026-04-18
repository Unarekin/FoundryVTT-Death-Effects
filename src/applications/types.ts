import { ConfigSource, DeathEffect, DeathEffectsConfig } from "types";

export interface TimelineContext extends foundry.applications.api.ApplicationV2.RenderContext {
  rootId: string;
  effects: DeathEffect[];
  buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
}

export interface PlaceableConfigContext<t extends foundry.abstract.Document.Any> extends foundry.applications.api.DocumentSheetV2.RenderContext<t> {
  deathEffects: {
    config: DeathEffectsConfig,
    source: ConfigSource;
    configSourceSelect: Partial<Record<ConfigSource, string>>;
  };
}