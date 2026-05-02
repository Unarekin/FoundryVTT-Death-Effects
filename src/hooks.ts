import { TokenMixin } from "./placeables";
import { DeathEffectsConfiguration, PrototypeTokenConfigMixin, StandalonePrototypeTokenConfig, StandaloneTokenConfig, TokenConfigMixin } from "./applications";
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

const standaloneConfigs: WeakMap<any, DeathEffectsConfiguration> = new WeakMap<any, DeathEffectsConfiguration>();



function getStandaloneConfig<t extends DeathEffectsConfiguration>(key: any, appType: (new (...args: any[]) => t)): t {
  if (standaloneConfigs.has(key))
    return standaloneConfigs.get(key) as unknown as t;
  const app = new appType(key);
  standaloneConfigs.set(key, app);
  return app;
}

function createHeaderButton(onClick: (() => void), canView?: (() => boolean)): foundry.applications.api.ApplicationV2.HeaderControlsEntry {
  return {
    icon: 'fa-solid fa-skull',
    label: "DEATH-EFFECTS.CONFIG.TITLE",
    onClick,
    visible: canView ? true : canView
  } as unknown as foundry.applications.api.ApplicationV2.HeaderControlsEntry;
}

function canModifyDocument(doc: foundry.abstract.Document.Any): boolean {
  return !!(game.user && doc.canUserModify(game.user, "update"));
}

Hooks.on("closeTokenConfig", (app: foundry.applications.sheets.TokenConfig) => {
  if (!app.document?.id) return;

  if (standaloneConfigs.has(app.document)) {
    standaloneConfigs.get(app.document)?.close().catch(console.error);
    standaloneConfigs.delete(app.document);
  }
});

// Hooks.on("closePrototypeTokenConfig", (app: foundry.applications.sheets.PrototypeTokenConfig) => {

// })

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Hooks.on("getHeaderControlsTokenConfig", ((app: foundry.applications.sheets.TokenConfig, controls: foundry.applications.api.ApplicationV2.HeaderControlsEntry[]) => {
  controls.unshift(createHeaderButton(() => {
    if (!app.document) return;
    const configApp = getStandaloneConfig<StandaloneTokenConfig>(app.document, StandaloneTokenConfig);
    configApp.render({ force: true }).catch(console.error);
  }, () => canModifyDocument(app.document)));
}) as any);

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
Hooks.on("getHeaderControlsPrototypeTokenConfig", ((app: foundry.applications.sheets.PrototypeTokenConfig, controls: foundry.applications.api.ApplicationV2.HeaderControlsEntry[]) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const token = (app as any).token as foundry.data.PrototypeToken;
  controls.unshift(createHeaderButton(() => {
    const configApp = getStandaloneConfig<StandalonePrototypeTokenConfig>(token, StandalonePrototypeTokenConfig);
    configApp.render({ force: true }).catch(console.error);
  }, () => canModifyDocument(token.actor)));
}) as any);