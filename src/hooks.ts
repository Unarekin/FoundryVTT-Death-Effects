import { TokenMixin } from "./placeables";
import { PrototypeTokenConfigMixin, StandaloneTokenConfig, TokenConfigMixin } from "./applications";
import { DeathPlaceable, DeepPartial } from "types";
import { SETTINGS } from "settings";

Hooks.on("canvasReady", () => {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (window as any).__PIXI_DEVTOOLS__ = {
      stage: canvas?.stage,
      renderer: canvas?.app?.renderer
    };
  }
});


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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    CONFIG.Token.prototypeSheetClass = PrototypeTokenConfigMixin(CONFIG.Token.prototypeSheetClass as any) as any;
  }
})


Hooks.on("updateActor", (actor: Actor, delta: Actor.UpdateData) => {
  if (actor.token?.object) {
    (actor.token.object as unknown as DeathPlaceable).checkAutoTriggerResource(actor, delta as DeepPartial<Actor>);
  } else {
    const tokens = actor.getActiveTokens();
    for (const token of tokens) {
      if (token.actor === actor)
        (token as unknown as DeathPlaceable).checkAutoTriggerResource(actor, delta as DeepPartial<Actor>);
    }
  }
});

Hooks.on("applyTokenStatusEffect", (token: foundry.canvas.placeables.Token, status: string, active: boolean) => {
  if (active) {
    (token as unknown as DeathPlaceable).checkAutoTriggerStatus(status);
  }
});

Hooks.on("updateActiveEffect", (effect: ActiveEffect, delta: ActiveEffect.UpdateData) => {
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

const standaloneConfigs: Record<string, StandaloneTokenConfig> = {};

Hooks.on("closeTokenConfig", (app: foundry.applications.sheets.TokenConfig) => {
  console.log("Closing token config:", app.document);
  if (!app.document?.id) return;

  if (standaloneConfigs[app.document.id])
    standaloneConfigs[app.document.id].close().catch(console.error);

  delete standaloneConfigs[app.document.id];
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Hooks.on("getHeaderControlsTokenConfig", ((app: foundry.applications.sheets.TokenConfig, controls: foundry.applications.api.ApplicationV2.HeaderControlsEntry[]) => {
  controls.push({
    icon: 'fa-solid fa-skull',
    label: "DEATH-EFFECTS.CONFIG.TITLE",
    onClick: () => {
      if (!app.document?.id) return;
      standaloneConfigs[app.document.id] ??= new StandaloneTokenConfig(app.document);
      standaloneConfigs[app.document.id].render({ force: true }).catch(console.error);
    }
  } as unknown as foundry.applications.api.ApplicationV2.HeaderControlsEntry);
  // We cast this to suppress linter errors about onClick which
  // does not exist in the typings but definitely does on the actual
  // object
}) as any);