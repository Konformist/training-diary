import { IExerciseStruct } from 'src/core/entities/training/TrainingStruct';

export default class ExerciseModel implements IExerciseStruct {
  approaches: number;

  muscle_group: string;

  name: string;

  repetitions: number;

  weight: number;

  constructor(struct?: IExerciseStruct) {
    this.approaches = struct?.approaches ?? 0;
    this.muscle_group = struct?.muscle_group ?? '';
    this.name = struct?.name ?? '';
    this.repetitions = struct?.repetitions ?? 0;
    this.weight = struct?.weight ?? 0;
  }

  getStruct() {
    return {
      approaches: this.approaches,
      muscle_group: this.muscle_group,
      name: this.name,
      repetitions: this.repetitions,
      weight: this.weight,
    };
  }
}
