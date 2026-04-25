import frag from "./crumble.frag";
import { CustomFilter } from '../CustomFilter';
import { SlideDirection } from "types";


// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type CrumbleUniforms = {
  progress: number;
  floatDist: number;
  textureSize: [number, number];
  direction: number;
}

export class CrumbleFilter extends CustomFilter<CrumbleUniforms> {
  constructor(floatDist: number, direction: SlideDirection, texture: PIXI.Texture) {
    const textureSize: [number, number] = [texture.width, texture.height];

    const actualDirection = direction === "up" ? 1 : -1;

    super(undefined, frag, {
      progress: 0,
      floatDist,
      textureSize,
      direction: actualDirection
    });
  }
}