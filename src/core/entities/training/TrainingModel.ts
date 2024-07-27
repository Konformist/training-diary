import EntityModel from 'src/core/entities/EntityModel';
import { TEntityModel } from 'src/core/entities/EntityStruct';
import TrainingExerciseModel from 'src/core/entities/training/TrainingExerciseModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';

export default class TrainingModel extends EntityModel implements TEntityModel<ITrainingStruct> {
  comment: string;

  date: number;

  exercises?: TrainingExerciseModel[];

  constructor(struct?: ITrainingStruct) {
    super(struct);
    this.comment = struct?.comment ?? '';
    this.date = struct?.date ?? (new Date()).getTime();
    this.exercises = (struct?.exercises ?? []).map((e) => new TrainingExerciseModel(e));
  }

  getStruct() {
    return {
      ...super.getStruct(),
      comment: this.comment,
      date: this.date,
      exercises: this.exercises?.map((e) => e.getStruct()),
    };
  }
}
