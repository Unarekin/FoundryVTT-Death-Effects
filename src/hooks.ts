import { TokenMixin } from "./placeables";
import { PrototypeTokenConfigMixin, StandaloneTokenConfig, TokenConfigMixin } from "./applications";
import { DeathPlaceable, DeepPartial } from "types";
import { SETTINGS } from "settings";

Hooks.on("canvasConfig", () => {
  const DeathToken = TokenMixin(CONFIG.Token.objectClass);
  CONFIG.Token.objectClass = DeathToken;
});


// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function applyMixin(collection: Record<string, any>, mixin: Function) {
  const entries = Object.entries(collection);
  for (const [key, { cls }] of entries) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    collection[key].cls = mixin(cls);
  }
}

Hooks.once("ready", () => {
  if (game.settings?.get(__MODULE_ID__, SETTINGS.injectTokenConfig)) {
    applyMixin(CONFIG.Token.sheetClasses.base, TokenConfigMixin);
    CONFIG.Token.prototypeSheetClass = PrototypeTokenConfigMixin(CONFIG.Token.prototypeSheetClass);
  }
})

Hooks.on("updateActor", (actor: Actor, delta: DeepPartial<Actor>) => {
  if (actor.token?.object) {
    (actor.token.object as unknown as DeathPlaceable).checkAutoTriggerResource(actor, delta);
  } else {
    const tokens = actor.getActiveTokens();
    for (const token of tokens) {
      if (token.actor === actor)
        (token as unknown as DeathPlaceable).checkAutoTriggerResource(actor, delta);
    }
  }
  // canvas?.scene?.tokens.contents.forEach(token => {
  //   if (!token.object) return;
  //   (token.object as unknown as DeathPlaceable).checkAutoTriggerResource(actor, delta);
  // });
});

Hooks.on("applyTokenStatusEffect", (token: foundry.canvas.placeables.Token, status: string, active: boolean) => {
  if (active) {
    (token as unknown as DeathPlaceable).checkAutoTriggerStatus(status);
    // canvas?.scene?.tokens.contents.forEach(token => {
    //   if (!token.object) return;
    //   (token.object as unknown as DeathPlaceable).checkAutoTriggerStatus(status);
    // })
  }
});

Hooks.on("updateActiveEffect", (effect: ActiveEffect, delta: DeepPartial<ActiveEffect>) => {
  if (delta.disabled === false) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ((effect.target as any)?.token instanceof TokenDocument) {

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (((effect.target as any).token as TokenDocument).object as unknown as DeathPlaceable).checkAutoTriggerActiveEffect(effect);
    }
  }
});

Hooks.on("createActiveEffect", (effect: ActiveEffect) => {
  if (!effect.disabled) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if ((effect.target as any)?.token instanceof TokenDocument) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (((effect.target as any).token as TokenDocument).object as unknown as DeathPlaceable).checkAutoTriggerActiveEffect(effect);
    }
  }
})

Hooks.on("getHeaderControlsTokenConfig", (app: foundry.applications.sheets.TokenConfig, controls: foundry.applications.api.ApplicationV2.HeaderControlsEntry[]) => {
  controls.push({
    icon: 'fa-solid fa-skull',
    label: "DEATH-EFFECTS.CONFIG.TITLE",
    onClick: () => {
      new StandaloneTokenConfig(app.document).render({ force: true }).catch(console.error);
    }
  })
})