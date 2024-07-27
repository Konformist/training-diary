import EntityModel from 'src/core/entities/EntityModel';
import { TEntityModel } from 'src/core/entities/EntityStruct';
import { ITrainingExerciseStruct } from 'src/core/entities/training/TrainingStruct';

export default class TrainingExerciseModel extends EntityModel implements TEntityModel<ITrainingExerciseStruct> {
  training_id: number;

  exercise_id: number;

  approaches: number;

  repetitions: number;

  weight: number;

  bind_next: number;

  bind_prev: number;

  constructor(struct?: ITrainingExerciseStruct) {
    super(struct);
    this.training_id = struct?.training_id ?? 0;
    this.exercise_id = struct?.exercise_id ?? 0;
    this.approaches = struct?.approaches ?? 0;
    this.repetitions = struct?.repetitions ?? 0;
    this.weight = struct?.weight ?? 0;
    this.bind_next = struct?.bind_next ?? 0;
    this.bind_prev = struct?.bind_prev ?? 0;
  }

  getStruct() {
    return {
      ...super.getStruct(),
      training_id: this.training_id,
      exercise_id: this.exercise_id,
      approaches: this.approaches,
      repetitions: this.repetitions,
      weight: this.weight,
      bind_next: this.bind_next,
      bind_prev: this.bind_prev,
    };
  }
}
