import { DefaultTokenMagicEffect } from "defaults";
import { BaseDeathEffect } from "./BaseEffect";
import { DeathPlaceable, TokenMagicDeathEffect } from "types";

export class TokenMagicEffect extends BaseDeathEffect<TokenMagicDeathEffect> {
  public static readonly Name = "DEATH-EFFECTS.EFFECTS.TOKENMAGIC.NAME";
  public readonly Name = TokenMagicEffect.Name;

  public static readonly Description = "DEATH-EFFECTS.EFFECTS.TOKENMAGIC.DESCRIPTION";
  public readonly Description = TokenMagicEffect.Description;

  public static readonly Icon = "fa-solid fa-fire";
  public readonly Icon = TokenMagicEffect.Icon;

  public static readonly Preview: string = `modules/${__MODULE_ID__}/assets/previews/TMFX Preview.webm`;
  public readonly Preview = TokenMagicEffect.Preview;

  public async execute(placeable: DeathPlaceable): Promise<void> {
    const config = foundry.utils.mergeObject(
      foundry.utils.deepClone(DefaultTokenMagicEffect),
      this.config
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await TokenMagic.addFilters(placeable, config.tmfxParams);

    // const mesh = placeable.getDeathSpriteObject();
    // if (!mesh) throw new Error(`No display object found for ${config.id}`);

    // await gsap.to(mesh, { alpha: 0, duration: config.duration / 1000, ease: "none" })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public teardown(placeable: DeathPlaceable): void | Promise<void> {
    // empty

  }

}
