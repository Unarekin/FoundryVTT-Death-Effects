import { DeathPlaceable } from "types";

function insertHUD(app: foundry.applications.hud.BasePlaceableHUD) {
  const obj = app.object as DeathPlaceable;
  if (!obj.document.isOwner) return;

  const col = app.element.querySelector('.col.left');
  if (!(col instanceof HTMLElement)) return console.warn("Unable to locate left column of placeable HUD");

  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("control-icon");
  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-skull");
  button.dataset.tooltip = game.i18n?.localize("DEATH-EFFECTS.HUD.PLAY");
  button.appendChild(icon);

  button.addEventListener("click", () => {
    const obj = app.object as DeathPlaceable;
    obj.playDeathEffects().catch(console.error);
  });
  col.appendChild(button);
}

Hooks.on("renderTokenHUD", (app: foundry.applications.hud.TokenHUD) => { insertHUD(app); });