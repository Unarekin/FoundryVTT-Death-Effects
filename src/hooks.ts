import { TokenMixin } from "./placeables";
import { PrototypeTokenConfigMixin, TokenConfigMixin } from "./applications";
import { DeathPlaceable, DeepPartial } from "types";

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
  applyMixin(CONFIG.Token.sheetClasses.base, TokenConfigMixin);
  CONFIG.Token.prototypeSheetClass = PrototypeTokenConfigMixin(CONFIG.Token.prototypeSheetClass);
})

Hooks.on("updateActor", (actor: Actor, delta: DeepPartial<Actor>) => {
  canvas?.scene?.tokens.contents.forEach(token => {
    if (!token.object) return;
    (token.object as unknown as DeathPlaceable).checkAutoTriggerResource(actor, delta);
  })
})