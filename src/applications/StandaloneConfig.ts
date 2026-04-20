/* eslint-disable @typescript-eslint/unbound-method */
import { downloadJSON, templatePath, uploadJSON } from "functions";
import { DeathEffectsConfig, DeepPartial } from "types";
import { StandaloneConfigContext } from "./types";
import { DefaultDeathEffectsConfig } from "settings";
import { TimelineEditor } from "./TimelineEditor";



export abstract class DeathEffectsConfiguration extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2<StandaloneConfigContext>) {

  static DEFAULT_OPTIONS: DeepPartial<foundry.applications.api.ApplicationV2.Configuration> = {
    window: {
      title: "DEATH-EFFECTS.CONFIG.TITLE",
      icon: `fa-solid fa-skull`,
      contentClasses: ["standard-form"],
      resizable: true
    },
    tag: "form",
    form: {
      submitOnChange: false
    },
    position: {
      width: 600
    },
    actions: {
      cancel: DeathEffectsConfiguration.Cancel,
      save: DeathEffectsConfiguration.Save,
      editTimeline: DeathEffectsConfiguration.EditTimeline
    }
  }
  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("config")
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  // #region Abstract Methods
  protected _onCancel(): void | Promise<void> { /* empty */ };
  protected abstract _onSave(data: DeathEffectsConfig): void | Promise<void>;
  protected abstract _getConfigData(): DeathEffectsConfig | undefined;
  // #endregion

  // #region Action Handlers

  static async Cancel(this: DeathEffectsConfiguration) {
    const onCancel = this._onCancel();
    if (onCancel instanceof Promise) await onCancel;
    await this.close();
  }

  static async Save(this: DeathEffectsConfiguration) {
    const data = this._prepareFormData();
    if (!data) return;

    const onSave = this._onSave(data);
    if (onSave instanceof Promise) await onSave;
    await this.close();
  }

  static async EditTimeline(this: DeathEffectsConfiguration) {
    try {
      const timeline = await new TimelineEditor().Edit(this.configCache?.effects ? foundry.utils.deepClone(this.configCache.effects) : []);
      if (timeline) {
        this.configCache ??= {} as DeathEffectsConfig;
        this.configCache.effects = foundry.utils.deepClone(timeline);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
    }
  }

  // #endregion

  protected configCache: DeathEffectsConfig | undefined = undefined;

  protected _prepareFormData(): DeathEffectsConfig | undefined {
    return this.configCache;
  }


  // #region Import/Export Functions
  protected _exportFileName(): string { return "death-effects.json"; }

  protected async _importEffectFromClipboard(): Promise<DeathEffectsConfig | undefined> {
    if ((await navigator.permissions.query({ name: "clipboard-read" })).state === "granted") {
      const text = await navigator.clipboard.readText();
      if (text) {
        const data = JSON.parse(text) as DeathEffectsConfig;
        ui.notifications?.info("DEATH-EFFECTS.CONFIG.IMPORT.PASTED", { localize: true });
        return data;
      }
    } else {
      const content = await foundry.applications.handlebars.renderTemplate(templatePath(`pasteJSON`), {});
      const { json } = await foundry.applications.api.DialogV2.input({
        window: { title: "DEATH-EFFECTS.CONFIG.IMPORT.LABEL" },
        position: { width: 600 },
        content
      });

      if (typeof json === "string") {
        const data = JSON.parse(json) as DeathEffectsConfig;
        if (data) return data;
      }
    }
  }

  protected async _importEffectFromUpload(): Promise<DeathEffectsConfig | undefined> {
    const data = await uploadJSON<DeathEffectsConfig>();
    if (!data) return;
    return data;
  }

  protected async _importEffectFromBrowse(): Promise<DeathEffectsConfig | undefined> {
    return new Promise((resolve, reject) => {
      void new foundry.applications.apps.FilePicker.implementation({
        extensions: [".json"],
        callback(path) {
          if (path) {
            try {
              foundry.utils.fetchJsonWithTimeout(path, undefined, { onTimeout: reject })
                .then(data => { resolve(data as DeathEffectsConfig) })
                .catch(reject);
            } catch (err) {
              reject(err as Error);
            }
          }
        }
      }).browse()
    })
  }

  protected async _handleEffectImport(func: (() => Promise<DeathEffectsConfig | undefined>)) {
    try {
      const data = await func();
      if (!data) return;

      this.configCache = foundry.utils.deepClone(data);
      await this.render();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
    }
  }

  protected async _exportEffectToClipboard() {
    try {
      const stringConfig = JSON.stringify(this.configCache)
      if ((await navigator.permissions.query({ name: "clipboard-write" })).state === "granted") {
        await navigator.clipboard.writeText(stringConfig);
        ui.notifications?.info("DEATH-EFFECTS.CONFIG.EXPORT.COPIED", { localize: true });
      } else {
        const content = await foundry.applications.handlebars.renderTemplate(templatePath(`copyJSON`), {
          config: stringConfig
        });
        await foundry.applications.api.DialogV2.input({
          window: { title: "DEATH-EFFECTS.CONFIG.EXPORT.LABEL" },
          position: { width: 600 },
          content
        });
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
    }
  }

  protected async _exportEffectToBrowse() {
    const path = (await new Promise(resolve => { void new foundry.applications.apps.FilePicker.implementation({ type: "folder", callback: resolve }).browse() }));
    if (typeof path !== "string") return;
    const file = new File([JSON.stringify(this.configCache)], `${this._exportFileName()}.json`, { type: "application/json" });
    await foundry.applications.apps.FilePicker.implementation.upload("data", path, file);
  }

  // #endregion

  protected _getDeathEffectImportContextItems(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[] {
    // TODO: Swap from name to label when dropping v13 support
    // TODO: Swap from callback to onClick when dropping v13 support
    return [
      {
        name: "DEATH-EFFECTS.CONFIG.IMPORT.CLIPBOARD",
        icon: `<i class="fa-solid fa-paste"></i>`,
        callback: () => { void this._handleEffectImport(this._importEffectFromClipboard); }
      },
      {
        name: "DEATH-EFFECTS.CONFIG.IMPORT.UPLOAD",
        icon: `<i class="fa-solid fa-upload"></i>`,
        callback: () => { void this._handleEffectImport(this._importEffectFromUpload); }
      },
      {
        name: "DEATH-EFFECTS.CONFIG.IMPORT.BROWSE",
        icon: `<i class="fa-solid fa-folder-tree"></i>`,
        callback: () => { void this._handleEffectImport(this._importEffectFromBrowse); }
      }
    ]
  }

  protected _getDeathEffectExportContextItems(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[] {
    // TODO: Swap from name to label when dropping v13 support
    // TODO: Swap from callback to onClick when dropping v13 support
    return [
      {
        name: "DEATH-EFFECTS.CONFIG.EXPORT.CLIPBOARD",
        icon: `<i class="fa-solid fa-copy"></i>`,
        callback: () => { this._exportEffectToClipboard().catch(console.error); }
      },
      {
        name: "DEATH-EFFECTS.CONFIG.EXPORT.DOWNLOAD",
        icon: `<i class="fa-solid fa-download"></i>`,
        callback: () => { downloadJSON({ ...this.configCache }, `${this._exportFileName()}.json`) }
      },
      {
        name: "DEATH-EFFECTS.CONFIG.EXPORT.BROWSE",
        icon: `<i class="fa-solid fa-save"></i>`,
        callback: () => { this._exportEffectToBrowse().catch(console.error); }
      }
    ]
  }


  // #region Render Functions

  _onChangeForm(formConfig: foundry.applications.api.ApplicationV2.FormConfiguration, e: Event) {
    super._onChangeForm(formConfig, e);

    const formData = foundry.utils.expandObject((new foundry.applications.ux.FormDataExtended(this.element as HTMLFormElement)).object) as { deathEffects: { config: DeathEffectsConfig } };
    const effects = this.configCache?.effects ?? [];
    this.configCache = formData.deathEffects.config;
    if (this.configCache) this.configCache.effects = effects;
  }

  async _onRender(context: StandaloneConfigContext, options: foundry.applications.api.ApplicationV2.RenderOptions) {
    await super._onRender(context, options);

    new foundry.applications.ux.ContextMenu<false>(this.element, `[data-role="import-death-effects"]`, this._getDeathEffectImportContextItems(), { jQuery: false, eventName: 'click', fixed: true });
    new foundry.applications.ux.ContextMenu<false>(this.element, `[data-role="export-death-effects"]`, this._getDeathEffectExportContextItems(), { jQuery: false, eventName: 'click', fixed: true });

    const triggerConditionSelect = this.element.querySelector(`[name="deathEffects.config.autoTriggerCondition"]`);
    if (triggerConditionSelect instanceof HTMLSelectElement) {
      triggerConditionSelect.addEventListener("change", () => {
        const sourceType = triggerConditionSelect.value;
        this.toggleElements(`[data-trigger-condition]:not([data-trigger-condition="${sourceType}"])`, false);
        this.toggleElements(`[data-trigger-condition="${sourceType}"]`, true);
      })
    }
  }


  protected toggleElements(selector: string, display: boolean) {
    const elements: HTMLElement[] = Array.from(this.element.querySelectorAll(selector))
    for (const element of elements) {
      element.style.display = display ? "flex" : "none";
    }
  }


  async _prepareContext(options: foundry.applications.api.ApplicationV2.RenderOptions): Promise<StandaloneConfigContext> {
    const context = await super._prepareContext(options);

    this.configCache ??= this._getConfigData();

    context.config = foundry.utils.deepClone(DefaultDeathEffectsConfig);
    foundry.utils.mergeObject(context.config, this.configCache);

    context.configSourceSelect = {};
    context.hasConfigSource = false;
    context.triggerConditionSelect = [
      { value: "resource", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.RESOURCE.LABEL", disabled: false },
      { value: "status", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.STATUS.LABEL", disabled: false },
      { value: "activeEffect", label: "DEATH-EFFECTS.CONFIG.TRIGGERCONDITION.ACTIVEEFFECT.LABEL", disabled: false }
    ]
    context.statusEffects = Object.fromEntries(CONFIG.statusEffects.map(eff => [eff.id, eff.name]));
    context.activeEffects = [];

    context.buttons = [
      { type: "button", action: "cancel", icon: "fa-solid fa-times", label: "Cancel" },
      { type: "submit", action: "save", icon: 'fa-solid fa-save', label: "Save" }
    ]

    return context;
  }
  // #enregion
}