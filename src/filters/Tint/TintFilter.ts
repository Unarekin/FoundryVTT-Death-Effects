import { CustomFilter } from "filters/CustomFilter";
import frag from "./TintFilter.frag";


export interface TintUniforms {
  tint: PIXI.ColorSource;
  ignoreAlpha: boolean;
}

export class TintFilter extends CustomFilter<TintUniforms> {

  public get tint() { return this.uniforms.tint as PIXI.ColorSource; }
  public set tint(val) {
    try {
      const color = new PIXI.Color(val);
      this.uniforms.tint = color;
    } catch (err) {
      console.error(err);
    }
  }

  public get color() { return this.tint; }
  public set color(val) { this.tint = val; }


  constructor(color: PIXI.ColorSource = "black", ignoreAlpha = false) {
    const actualColor = new PIXI.Color(color);
    super(undefined, frag, { tint: actualColor.toRgbArray(), ignoreAlpha });
  }
}