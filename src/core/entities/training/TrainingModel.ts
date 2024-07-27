import EntityModel from 'src/core/entities/EntityModel';
import { TEntityModel } from 'src/core/entities/EntityStruct';
import TrainingExerciseModel from 'src/core/entities/training/TrainingExerciseModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';

export default class TrainingModel extends EntityModel implements TEntityModel<ITrainingStruct> {
  tag_id: number;

  date: number;

  comment: string;

  exercises?: TrainingExerciseModel[];

  constructor(struct?: ITrainingStruct) {
    super(struct);
    this.tag_id = struct?.tag_id ?? 0;
    this.date = struct?.date ?? (new Date()).getTime();
    this.comment = struct?.comment ?? '';
    this.exercises = (struct?.exercises ?? []).map((e) => new TrainingExerciseModel(e));
  }

  getStruct() {
    return {
      ...super.getStruct(),
      tag_id: this.tag_id,
      date: this.date,
      comment: this.comment,
      exercises: this.exercises?.map((e) => e.getStruct()),
    };
  }
}
