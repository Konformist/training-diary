import { IExerciseStruct } from 'src/core/entities/training/TrainingStruct';

export default class ExerciseModel implements IExerciseStruct {
  id: number;

  name: string;

  muscle_group: string;

  approaches: number;

  repetitions: number;

  weight: number;

  constructor(struct?: IExerciseStruct) {
    this.id = struct?.id ?? 1;
    this.name = struct?.name ?? '';
    this.muscle_group = struct?.muscle_group ?? '';
    this.approaches = struct?.approaches ?? 0;
    this.repetitions = struct?.repetitions ?? 0;
    this.weight = struct?.weight ?? 0;
  }

  getStruct(): IExerciseStruct {
    return {
      id: this.id,
      name: this.name,
      muscle_group: this.muscle_group,
      approaches: this.approaches,
      repetitions: this.repetitions,
      weight: this.weight,
    };
  }
}
