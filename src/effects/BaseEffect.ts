import { DeathEffect, DeathPlaceable } from "types";

export abstract class BaseDeathEffect<t extends DeathEffect> {
  public static get Name(): string { throw new Error("Not implemented"); }
  public static get Description(): string { throw new Error("Not implemented"); }
  public static get Icon(): string { throw new Error("Not implemented"); }

  public abstract get Name(): string;
  public abstract get Description(): string;
  public abstract get Icon(): string;

  public static canEditDuration(config: DeathEffect): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return typeof (config as any)?.duration === "number";
  }

  public static getDuration(config: DeathEffect): number | Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return ((config as any)?.duration as number) ?? 0;
  }


  public abstract execute(placeable: DeathPlaceable): Promise<void> | void;



  constructor(public config?: t) { }
}
