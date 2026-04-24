import { DefaultSoundEffect } from "settings";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, SoundDeathEffect } from "types";

export class SoundEffect extends BaseDeathEffect<SoundDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.SOUND.NAME";
  public readonly Name = SoundEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.SOUND.DESCRIPTION";
  public readonly Description = SoundEffect.Description;

  public static readonly Icon = "de-icon sound";
  public readonly Icon = SoundEffect.Icon;

  public static async getDuration(config: SoundDeathEffect): Promise<number> {
    if (!config.sound) return 0;
    const exist = await foundry.canvas.srcExists(config.sound);
    if (!exist) return 0;
    return new Promise<number>((resolve, reject) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => { resolve(Math.round(audio.duration * 1000)); };
      audio.onerror = (e, src, line, col, err) => {
        if (err) reject(err);
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        else reject(new Error(e.toString()));
      }
      audio.src = config.sound;
    })
  }


  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultSoundEffect),
      this.config
    );

    if (config.playAtLocation) {
      const sound = new foundry.audio.Sound(config.sound);
      // TODO: Implement radius
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      (sound as any).playAtPosition({ x: placeable.x, y: placeable.y }, 3, { volume: config.volume })
    } else {
      await foundry.audio.AudioHelper.play({ src: config.sound, volume: config.volume }, false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty
  }

}
