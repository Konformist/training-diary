import { ITrainingExerciseStruct } from 'src/core/entities/training/TrainingStruct';

export default class TrainingExerciseModel implements ITrainingExerciseStruct {
  id: number;

  exercise_id: number;

  approaches: number;

  repetitions: number;

  weight: number;

  bind_next: number;

  bind_prev: number;

  constructor(struct?: ITrainingExerciseStruct) {
    this.id = struct?.id ?? 1;
    this.exercise_id = struct?.exercise_id ?? 0;
    this.approaches = struct?.approaches ?? 0;
    this.repetitions = struct?.repetitions ?? 0;
    this.weight = struct?.weight ?? 0;
    this.bind_next = struct?.bind_next ?? 0;
    this.bind_prev = struct?.bind_prev ?? 0;
  }

  getStruct(): ITrainingExerciseStruct {
    return {
      id: this.id,
      exercise_id: this.exercise_id,
      approaches: this.approaches,
      repetitions: this.repetitions,
      weight: this.weight,
      bind_next: this.bind_next,
      bind_prev: this.bind_prev,
    };
  }
}
