import { CrumbleDeathEffect, DeathEffect, SlideDeathEffect, SlideDirection, StartPlaylistDeathEffect, TokenMagicDeathEffect } from "types";

export interface EffectRenderContext<t extends DeathEffect> extends foundry.applications.api.ApplicationV2.RenderContext {
  rootId: string;
  buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
  effect: t;
  easingSelect: Record<string, string>;
  fields?: Record<string, foundry.data.fields.DataField>;
}

export interface StartPlaylistRenderContext extends EffectRenderContext<StartPlaylistDeathEffect> {
  playlistOptions: Record<string, string>;
  playlistSounds: Record<string, string>;
}


export interface TMFXConfigContext extends EffectRenderContext<TokenMagicDeathEffect> {
  tmfxPresets: string[];
}

export interface SlideConfigContext extends EffectRenderContext<SlideDeathEffect> {
  directionSelect: Record<SlideDirection, string>;
}

export interface CrumbleConfigContext extends EffectRenderContext<CrumbleDeathEffect> {
  directionSelect: Partial<Record<SlideDirection, string>>;
}
