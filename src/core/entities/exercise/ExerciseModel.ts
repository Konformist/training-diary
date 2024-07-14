import { IExerciseStruct } from 'src/core/entities/exercise/ExerciseStruct';

export default class ExerciseModel implements IExerciseStruct {
  id: number;

  name: string;

  muscle_group_id: number;

  constructor(struct?: IExerciseStruct) {
    this.id = struct?.id ?? 0;
    this.name = struct?.name ?? '';
    this.muscle_group_id = struct?.muscle_group_id ?? 0;
  }

  getStruct(): IExerciseStruct {
    return {
      id: this.id,
      name: this.name,
      muscle_group_id: this.muscle_group_id,
    };
  }
}
