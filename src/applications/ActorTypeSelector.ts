/* eslint-disable @typescript-eslint/unbound-method */
import { DeepPartial } from "types";
import { ActorTypeSelectionContext } from "./types";
import { templatePath } from "functions";
import { ActorTypeConfig } from "./ActorTypeConfig";

export class ActorTypeSelector extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2<ActorTypeSelectionContext>) {
  public static DEFAULT_OPTIONS: DeepPartial<foundry.applications.api.ApplicationV2.Configuration> = {
    window: {
      title: "DEATH-EFFECTS.CONFIG.ACTORTYPE.TITLE",
      icon: "fa-solid fa-skull",
      contentClasses: ["standard-form"]
    },
    tag: "form",
    form: {
      closeOnSubmit: true,
      submitOnChange: false
    },
    actions: {
      close: ActorTypeSelector.Close,
      select: ActorTypeSelector.Select
    }
  }

  public static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    buttons: {
      template: templatePath('actorTypeList')
    },
    footer: {
      template: 'templates/generic/form-footer.hbs'
    }
  }

  // #region Acton Handlers
  public static async Close(this: ActorTypeSelector) { await this.close(); }

  public static async Select(this: ActorTypeSelector, event: PointerEvent, elem: HTMLElement) {
    const actorType = elem.dataset.type;
    if (!actorType) return console.warn(`No actor type set`);
    const app = new ActorTypeConfig(actorType);
    await Promise.all([
      app.render({ force: true }),
      this.close()
    ])


  }
  // #endregion

  // #region Render Handlers
  protected async _prepareContext(options: foundry.applications.api.ApplicationV2.RenderOptions): Promise<ActorTypeSelectionContext> {
    const context = await super._prepareContext(options);
    context.types = Actor.TYPES
      .filter(type => type !== "base")
      .map(type => ({
        value: type,
        label: CONFIG.Actor.typeLabels[type]
      }));

    context.buttons = [
      { type: "button", icon: "fa-solid fa-times", label: "Close", action: "close" }
    ]

    return context;
  }
  // #endregion
}