import { ITrainingExerciseStruct } from 'src/core/entities/training/TrainingStruct';

export default class TrainingExerciseModel implements ITrainingExerciseStruct {
  id: number;

  exercise_id: number;

  name: string;

  muscle_group: string;

  approaches: number;

  repetitions: number;

  weight: number;

  constructor(struct?: ITrainingExerciseStruct) {
    this.id = struct?.id ?? 1;
    this.exercise_id = struct?.exercise_id ?? 0;
    this.name = struct?.name ?? '';
    this.muscle_group = struct?.muscle_group ?? '';
    this.approaches = struct?.approaches ?? 0;
    this.repetitions = struct?.repetitions ?? 0;
    this.weight = struct?.weight ?? 0;
  }

  getStruct(): ITrainingExerciseStruct {
    return {
      id: this.id,
      exercise_id: this.exercise_id,
      name: this.name,
      muscle_group: this.muscle_group,
      approaches: this.approaches,
      repetitions: this.repetitions,
      weight: this.weight,
    };
  }
}
