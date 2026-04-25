import frag from "./dust.frag";
import { CustomFilter } from '../CustomFilter';


// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type DustUniforms = {
  progress: number;
  direction: [number, number];
  vignette_strength: number;
  vignette_center: [number, number];
  seed: number;
}

export class DustFilter extends CustomFilter<DustUniforms> {
  constructor(direction: [number, number]) {

    super(undefined, frag, {
      progress: 0,
      direction,
      vignette_strength: 0.5,
      vignette_center: [0.5, 0.3],
      seed: 0.5
    });
  }
}