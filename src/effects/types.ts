import { DeathEffect } from "types";

export interface EffectRenderContext<t extends DeathEffect> extends foundry.applications.api.ApplicationV2.RenderContext {
  rootId: string;
  buttons: foundry.applications.api.ApplicationV2.FormFooterButton[];
  effect: t;
}