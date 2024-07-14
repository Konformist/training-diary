import { IMuscleStruct } from 'src/core/entities/muscle/MuscleStruct';

export default class MuscleModel implements IMuscleStruct {
  id: number;

  name: string;

  constructor(struct?: IMuscleStruct) {
    this.id = struct?.id ?? 0;
    this.name = struct?.name ?? '';
  }

  getStruct(): IMuscleStruct {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
