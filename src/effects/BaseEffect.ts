import { DeathEffect } from "types";

export abstract class BaseDeathEffect<t extends DeathEffect> {
  public static get Name(): string { throw new Error("Not implemented"); }
  public static get Description(): string { throw new Error("Not implemented"); }
  public static get Icon(): string { throw new Error("Not implemented"); }

  public abstract get Name(): string;
  public abstract get Description(): string;
  public abstract get Icon(): string;


  public abstract execute(placeable: foundry.canvas.placeables.PlaceableObject): Promise<void>;



  constructor(public config?: t) { }
}
