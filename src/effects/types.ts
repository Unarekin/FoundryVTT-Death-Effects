import { DeathEffect, StartPlaylistDeathEffect } from "types";

export interface EffectRenderContext<t extends DeathEffect> extends foundry.applications.api.ApplicationV2.RenderContext {
  rootId: string;
  buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
  effect: t;
  fields?: Record<string, foundry.data.fields.DataField>;
}

export interface StartPlaylistRenderContext extends EffectRenderContext<StartPlaylistDeathEffect> {
  playlistOptions: Record<string, string>;
  playlistSounds: Record<string, string>;
}