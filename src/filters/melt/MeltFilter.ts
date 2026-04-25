import frag from "./melt.frag";
import { CustomFilter } from '../CustomFilter';


// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type MeltUniforms = {
  progress: number;
  offsets: number[];
}

export class MeltFilter extends CustomFilter<MeltUniforms> {
  constructor() {

    super(undefined, frag, {
      progress: 0,
      offsets: new Array(512).fill(0).map(() => Math.random() + 1)
    });
  }
}