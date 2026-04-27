import { BaseEffectApplication } from "./BaseEffectApplication";
import { DeepPartial, StartPlaylistDeathEffect } from "types";
import { DefaultStartPlaylistEffect } from "defaults";
import { templatePath } from "functions";
import { EffectRenderContext, StartPlaylistRenderContext } from "./types";

type Configuration = foundry.applications.api.ApplicationV2.Configuration;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderContext = foundry.applications.api.ApplicationV2.RenderContext;
type RenderOptions = foundry.applications.api.ApplicationV2.RenderOptions;

export class StartPlaylistEffectApplication extends BaseEffectApplication<StartPlaylistDeathEffect> {

  static DEFAULT_OPTIONS: DeepPartial<Configuration> = {
    ...(BaseEffectApplication.DEFAULT_OPTIONS ?? {}),
    window: {
      ...(BaseEffectApplication.DEFAULT_OPTIONS.window ?? {}),
      title: "DEATH-EFFECTS.EFFECTS.STARTPLAYLIST.NAME"
    }
  }

  static PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart> = {
    base: {
      template: templatePath("effects/startPlaylist"),
      templates: [
        templatePath("effects/partials/label"),
        templatePath("effects/partials/start")
      ]
    },
    footer: {
      template: `templates/generic/form-footer.hbs`
    }
  }

  public static async Edit(config?: StartPlaylistDeathEffect): Promise<StartPlaylistDeathEffect | undefined> {
    return new StartPlaylistEffectApplication(config ?? foundry.utils.deepClone(DefaultStartPlaylistEffect)).Edit();
  }

  protected getDefaultSettings(): StartPlaylistDeathEffect {
    return foundry.utils.deepClone(DefaultStartPlaylistEffect);
  }

  async _prepareContext(options: foundry.applications.api.ApplicationV2.RenderOptions) {
    const context = await super._prepareContext(options) as unknown as StartPlaylistRenderContext;

    context.playlistOptions = Object.fromEntries((game.playlists ?? [])?.map(playlist => [playlist.id, playlist.name]));

    if (this.config.playlist) {
      const playlist = game.playlists?.get(this.config.playlist);
      if (playlist)
        context.playlistSounds = Object.fromEntries(playlist.sounds.contents.map(sound => [sound.id, sound.name])) as Record<string, string>;
    } else {
      context.playlistSounds = {};
    }

    return context as EffectRenderContext<StartPlaylistDeathEffect>;
  }

  async _onRender(context: StartPlaylistRenderContext, options: RenderOptions) {
    await super._onRender(context, options);

    const playlistSelect = this.element.querySelector(`[name="playlist"]`);
    if (playlistSelect instanceof HTMLSelectElement) {
      playlistSelect.addEventListener("change", () => {
        this.config.playlist = playlistSelect.value;
        this.render().catch(console.error);
      });
    }
  }
}