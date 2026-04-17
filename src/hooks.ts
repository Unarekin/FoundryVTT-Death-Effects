import { TokenMixin } from "./placeables";
import { TokenConfigMixin } from "./applications";

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
})