import EntityModel from 'src/core/entities/EntityModel';
import { TEntityModel } from 'src/core/entities/EntityStruct';
import { TrainingExerciseStruct } from 'src/core/entities/training-exercise/TrainingExerciseStruct';

export default class TrainingExerciseModel extends EntityModel implements TEntityModel<TrainingExerciseStruct> {
  training_id: number;

  exercise_id: number;

  approaches: number;

  repetitions: number;

  weight: number;

  rest_time: string;

  bind_next: number;

  bind_prev: number;

  constructor(struct?: TrainingExerciseStruct) {
    super(struct);
    this.training_id = struct?.training_id ?? 0;
    this.exercise_id = struct?.exercise_id ?? 0;
    this.approaches = struct?.approaches ?? 0;
    this.repetitions = struct?.repetitions ?? 0;
    this.weight = struct?.weight ?? 0;
    this.bind_next = struct?.bind_next ?? 0;
    this.bind_prev = struct?.bind_prev ?? 0;
    this.rest_time = struct?.rest_time ?? '';
  }

  getStruct() {
    return {
      ...super.getStruct(),
      training_id: this.training_id,
      exercise_id: this.exercise_id,
      approaches: this.approaches,
      repetitions: this.repetitions,
      weight: this.weight,
      rest_time: this.rest_time,
      bind_next: this.bind_next,
      bind_prev: this.bind_prev,
    };
  }
}
