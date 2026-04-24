/* eslint-disable @typescript-eslint/unbound-method */
import { DeathEffect, DeepPartial } from "types";
import { EffectRenderContext } from "./types";

export abstract class BaseEffectApplication<t extends DeathEffect> extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {

  static DEFAULT_OPTIONS: DeepPartial<foundry.applications.api.ApplicationV2.Configuration> = {
    window: {
      resizable: true,
      contentClasses: ["standard-form"]
    },
    tag: "form",
    form: {
      submitOnChange: false,
      handler: BaseEffectApplication.FormHandler
    },
    actions: {
      cancel: BaseEffectApplication.Cancel
    }
  }

  protected editPromise: Promise<t | undefined> | undefined = undefined;
  protected editResolve: ((effect: t | undefined) => void) | undefined = undefined;

  protected abstract getDefaultSettings(): t;

  protected parseFormFields(): t {
    const form = foundry.utils.expandObject((new foundry.applications.ux.FormDataExtended(this.element as HTMLFormElement)).object) as t;
    const parsed = foundry.utils.deepClone(this.getDefaultSettings());
    foundry.utils.mergeObject(parsed, form);

    if (!parsed.id) parsed.id = foundry.utils.randomID();
    return parsed;
  }

  static async Cancel(this: BaseEffectApplication<any>) {
    if (this.editResolve) this.editResolve(undefined);
    this.editResolve = undefined;
    this.editPromise = undefined;
    await this.close();
  }

  static async FormHandler(this: BaseEffectApplication<any>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = this.parseFormFields();

    if (this.editResolve)
      this.editResolve(data);
    this.editResolve = undefined;
    this.editPromise = undefined;
    await this.close();
  }

  protected _onClose(options: foundry.applications.api.ApplicationV2.RenderOptions): void {
    if (this.editResolve) this.editResolve(undefined);
    this.editResolve = undefined;
    this.editPromise = undefined;
    super._onClose(options);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  public static async Edit(config?: DeathEffect): Promise<DeathEffect | undefined> {
    throw new Error("Not implemented");
  }

  public async Edit(config?: t): Promise<t | undefined> {
    if (config) this.config = config;

    this.editPromise ??= new Promise(resolve => {
      this.editResolve = resolve;
    });

    if (!this.rendered) await this.render({ force: true });

    return this.editPromise;
  }

  _onChangeForm(formConfig: foundry.applications.api.ApplicationV2.FormConfiguration, e: Event) {
    super._onChangeForm(formConfig, e);
    this.config = this.parseFormFields();
  }

  async _prepareContext(options: foundry.applications.api.ApplicationV2.RenderOptions) {
    const context = await super._prepareContext(options) as EffectRenderContext<t>;
    context.effect = foundry.utils.deepClone(this.config);
    context.rootId = context.effect.id;

    context.buttons = [
      { type: "button", action: "cancel", label: "Cancel", icon: "fa-solid fa-times" },
      { type: "submit", label: "Save", icon: "fa-solid fa-save" }
    ]

    return context;
  }

  constructor(public config: t, options?: foundry.applications.api.ApplicationV2.Configuration) {
    super(options);
  }
}
