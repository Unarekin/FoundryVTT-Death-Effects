/* eslint-disable @typescript-eslint/unbound-method */
import { ConfigSource, Constructor, DeathEffect, DeepPartial, DeathEffectsConfig as FlagConfig } from "types";
import { PlaceableConfigContext } from "./types"
import { DefaultDeathEffectsConfig } from "defaults";
import { downloadJSON, templatePath, uploadJSON } from "functions";
import { TimelineEditor } from "./TimelineEditor";


type RenderOptions = foundry.applications.api.DocumentSheetV2.RenderOptions;
type TabsConfiguration = foundry.applications.api.ApplicationV2.TabsConfiguration

export function ConfigMixin<t extends Constructor<foundry.applications.api.DocumentSheetV2.Any>>(base: t) {
  const TABS = ((base as Record<string, unknown>).TABS as Record<string, TabsConfiguration>);
  const PARTS = ((base as Record<string, unknown>).PARTS as Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>);
  const DEFAULT_OPTIONS = ((base as Record<string, unknown>).DEFAULT_OPTIONS as foundry.applications.api.DocumentSheetV2.Configuration<TokenDocument>);

  abstract class DeathEffectsConfig extends base {

    protected deathEffects: DeathEffect[] | undefined = undefined;
    protected deathConfigOverrides: Partial<FlagConfig> | undefined = undefined;


    static TABS: Record<string, TabsConfiguration> = {
      ...TABS,
      sheet: {
        ...TABS.sheet,
        tabs: [
          ...(TABS.sheet.tabs ?? []),
          {
            id: "deathEffects",
            cssClass: "",
            icon: "fa-solid fa-skull"
          }
        ]
      }
    }

    static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
      ...PARTS,
      deathEffects: {
        template: templatePath('configTab'),
        templates: [templatePath('config')]
      },
    }

    static DEFAULT_OPTIONS: DeepPartial<foundry.applications.api.HandlebarsApplicationMixin.Configuration> = {
      ...DEFAULT_OPTIONS,
      actions: {
        ...DEFAULT_OPTIONS.actions,
        editTimeline: DeathEffectsConfig.EditTimeline
      }
    }

    protected _timelineEditor: TimelineEditor | undefined = undefined;


    static async EditTimeline(this: DeathEffectsConfig) {
      try {

        this._timelineEditor ??= new TimelineEditor();

        await this._timelineEditor.render({ force: true });
        const timeline = await this._timelineEditor.Edit(this.deathEffects ? foundry.utils.deepClone(this.deathEffects) : []);

        if (timeline)
          this.deathEffects = foundry.utils.deepClone(timeline);
      } catch (err) {
        console.error(err);
        if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
      }
    }

    protected overrideDeathEffectConfigSource: ConfigSource | undefined = undefined;

    protected abstract getDeathEffectFlags(source?: ConfigSource): FlagConfig | undefined;
    protected abstract getDeathEffectSource(): ConfigSource;

    protected toggleDeathEffectForm(enabled: boolean) {
      const elems = this.element.querySelectorAll(`[data-toggle-death-effects]`);
      for (const elem of elems) {
        if (elem instanceof HTMLInputElement || elem instanceof HTMLSelectElement) {
          elem.disabled = !enabled;
        } else if (enabled) {
          elem.removeAttribute("disabled");
          elem.classList.remove("disabled");
        } else {
          elem.setAttribute("disabled", "disabled");
          elem.classList.add("disabled");
        }
      }
    }

    _onChangeForm(formConfig: foundry.applications.api.ApplicationV2.FormConfiguration, e: Event) {
      super._onChangeForm(formConfig, e);
      const data = foundry.utils.expandObject(new foundry.applications.ux.FormDataExtended(this.element as HTMLFormElement).object) as { deathEffects: Partial<FlagConfig> };
      this.deathConfigOverrides = foundry.utils.deepClone(data.deathEffects);
    }

    _onClose(options: RenderOptions) {
      if (this._timelineEditor) this._timelineEditor.close().catch(console.error);

      super._onClose(options);
      this.overrideDeathEffectConfigSource = undefined;
      this.deathEffects = undefined;
      this.deathConfigOverrides = undefined;
      this._timelineEditor = undefined;
    }

    // #region Import/Export


    protected async _importEffectFromClipboard(): Promise<FlagConfig | undefined> {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if ((await navigator.permissions.query({ name: "clipboard-read" } as any)).state === "granted") {
        const text = await navigator.clipboard.readText();
        if (text) {
          const data = JSON.parse(text) as FlagConfig;
          ui.notifications?.info("DEATH-EFFECTS.CONFIG.IMPORT.PASTED", { localize: true });
          return data;
        }
      } else {
        const content = await foundry.applications.handlebars.renderTemplate(templatePath(`pasteJSON`), {});
        const { json } = (await foundry.applications.api.DialogV2.input({
          window: { title: "DEATH-EFFECTS.CONFIG.IMPORT.LABEL" },
          position: { width: 600 },
          content
        })) as { json?: string };

        if (typeof json === "string") {
          const data = JSON.parse(json) as FlagConfig;
          if (data) return data;
        }
      }
    }

    protected async _importEffectFromUpload(): Promise<FlagConfig | undefined> {
      const data = await uploadJSON<FlagConfig>();
      if (!data) return;
      return data;
    }

    protected async _importEffectFromBrowse(): Promise<FlagConfig | undefined> {
      return new Promise((resolve, reject) => {
        void new foundry.applications.apps.FilePicker.implementation({
          extensions: [".json"],
          callback(path: string) {
            if (path) {
              try {
                foundry.utils.fetchJsonWithTimeout(path, undefined, { onTimeout: reject })
                  .then(data => { resolve(data as FlagConfig) })
                  .catch(reject);
              } catch (err) {
                reject(err as Error);
              }
            }
          }
        } as any).browse()
      })
    }

    protected async _handleEffectImport(func: (() => Promise<FlagConfig | undefined>)) {
      try {
        const data = await func();
        if (!data) return;

        if (data.effects?.length)
          this.deathEffects = foundry.utils.deepClone(data.effects);
        this.deathConfigOverrides = foundry.utils.deepClone(data);
        this.deathEffects = foundry.utils.deepClone(data.effects ?? []);
        await this.render();
      } catch (err) {
        console.error(err);
        if (err instanceof Error) ui.notifications?.error(err.message, { console: false });
      }
    }

    protected async _exportEffectToClipboard() {
      try {
        const stringConfig = JSON.stringify({
          ...this.deathConfigOverrides,
          effects: this.deathEffects
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if ((await navigator.permissions.query({ name: "clipboard-write" } as any)).state === "granted") {
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
      const file = new File([JSON.stringify({
        ...this.deathConfigOverrides,
        effects: this.deathEffects
      })], `${this.document.name}.json`, { type: "application/json" });
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
          callback: () => { downloadJSON({ ...this.deathConfigOverrides, effects: this.deathEffects }, `${this.document.name}.json`) }
        },
        {
          name: "DEATH-EFFECTS.CONFIG.EXPORT.BROWSE",
          icon: `<i class="fa-solid fa-save"></i>`,
          callback: () => { this._exportEffectToBrowse().catch(console.error); }
        }
      ]
    }


    async _onRender(context: PlaceableConfigContext<foundry.abstract.Document.Any>, options: RenderOptions) {
      await super._onRender(context, options);

      new foundry.applications.ux.ContextMenu<false>(this.element, `[data-role="import-death-effects"]`, this._getDeathEffectImportContextItems(), { jQuery: false, eventName: 'click', fixed: true });
      new foundry.applications.ux.ContextMenu<false>(this.element, `[data-role="export-death-effects"]`, this._getDeathEffectExportContextItems(), { jQuery: false, eventName: 'click', fixed: true });

      const sourceSelect = this.element.querySelector(`[name="deathEffects.source"]`);
      if (sourceSelect instanceof HTMLSelectElement) {
        this.toggleDeathEffectForm(sourceSelect.value === "token" || sourceSelect.value === "actor");
        sourceSelect.addEventListener("change", () => {
          // this.toggleDeathEffectForm(sourceSelect.value === "token" || sourceSelect.value === "actor");
          this.overrideDeathEffectConfigSource = sourceSelect.value as ConfigSource;
          this.deathEffects = undefined;
          this.deathConfigOverrides = undefined;
          this.render().catch(console.error);
        })
      }

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

    async _prepareContext(options: RenderOptions): Promise<PlaceableConfigContext<foundry.abstract.Document.Any>> {
      const context = await super._prepareContext(options) as PlaceableConfigContext<foundry.abstract.Document.Any>;

      // const config = ((this.document.flags as Record<string, unknown>)[__MODULE_ID__] as FlagConfig);

      const config = (this.deathConfigOverrides as FlagConfig) ?? this.getDeathEffectFlags(this.overrideDeathEffectConfigSource);

      context.deathEffects = {
        source: this.overrideDeathEffectConfigSource ?? this.getDeathEffectSource(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        config: foundry.utils.mergeObject(
          foundry.utils.deepClone(DefaultDeathEffectsConfig),
          config ?? {}
        ) as any,
        hasConfigSource: true,
        configSourceSelect: {
          global: "DEATH-EFFECTS.CONFIG.SOURCE.GLOBAL"
        },
        hasTriggerConditions: false,
        activeEffects: []
      }

      if (this.deathEffects)
        context.deathEffects.config.effects = foundry.utils.deepClone(this.deathEffects);
      else
        this.deathEffects = foundry.utils.deepClone(context.deathEffects.config.effects);

      return context;
    }
  }

  if (DeathEffectsConfig.PARTS?.footer) {
    const footer = DeathEffectsConfig.PARTS.footer;
    delete DeathEffectsConfig.PARTS.footer;
    DeathEffectsConfig.PARTS.footer = footer;
  }

  return DeathEffectsConfig;
}