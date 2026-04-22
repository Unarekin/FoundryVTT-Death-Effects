import { DefaultStartPlaylistEffect } from "settings";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, StopPlaylistDeathEffect } from "types";

export class StartPlaylistEffect extends BaseDeathEffect<StopPlaylistDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.STARTPLAYLIST.NAME";
  public readonly Name = StartPlaylistEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.STARTPLAYLIST.DESCRIPTION";
  public readonly Description = StartPlaylistEffect.Description;

  public static readonly Icon = "fa-solid fa-play";
  public readonly Icon = StartPlaylistEffect.Icon;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(placeable: DeathPlaceable) {
    if (!game.user?.isActiveGM) return;

    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultStartPlaylistEffect),
      this.config
    );

    const playlist = game.playlists?.get(config.playlist);
    const sound = config.sound ? playlist.sounds.get(config.sound) : undefined;

    if (sound) await playlist.playSound(sound);
    else await playlist.playAll();
  }

}
