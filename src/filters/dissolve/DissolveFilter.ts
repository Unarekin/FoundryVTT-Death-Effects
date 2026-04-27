import frag from "./dissolve.frag";
import { CustomFilter } from '../CustomFilter';


// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type DissolveUniforms = {
  progress: number;
  block_size: number;
  pixel_size: [number, number];
}

export class DissolveFilter extends CustomFilter<DissolveUniforms> {
  constructor(blockSize: number, texture: PIXI.Texture) {
    const pixel_size: [number, number] = [1 / texture.width, 1 / texture.height];

    super(undefined, frag, {
      progress: 0,
      block_size: blockSize,
      pixel_size
    });
  }
}