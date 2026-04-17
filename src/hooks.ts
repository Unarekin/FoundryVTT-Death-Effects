import { TokenMixin } from "./placeables";
Hooks.on("canvasConfig", () => {
  const DeathToken = TokenMixin(CONFIG.Token.objectClass);
  CONFIG.Token.objectClass = DeathToken;
})