// import { DefaulStopPlaylistEffect } from "settings";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, StopPlaylistDeathEffect } from "types";

export class StopPlaylistEffect extends BaseDeathEffect<StopPlaylistDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.STOPPLAYLIST.NAME";
  public readonly Name = StopPlaylistEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.STOPPLAYLIST.DESCRIPTION";
  public readonly Description = StopPlaylistEffect.Description;

  public static readonly Icon = "fa-solid fa-stop";
  public readonly Icon = StopPlaylistEffect.Icon;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public execute(placeable: DeathPlaceable): void {
    if (!game.user?.isActiveGM) return;

    game.playlists?.forEach(playlist => {
      if (playlist.playing)
        playlist.stopAll().catch(console.error);
    });
  }

}
