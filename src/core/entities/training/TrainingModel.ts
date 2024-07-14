import TrainingExerciseModel from 'src/core/entities/training/TrainingExerciseModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';

export default class TrainingModel implements ITrainingStruct {
  id: number;

  name: string;

  comment: string;

  date: number;

  exercises: TrainingExerciseModel[];

  constructor(struct?: ITrainingStruct) {
    this.id = struct?.id ?? 1;
    this.name = struct?.name ?? '';
    this.comment = struct?.comment ?? '';
    this.date = struct?.date ?? (new Date()).getTime();
    this.exercises = (struct?.exercises ?? []).map((e) => new TrainingExerciseModel(e));
  }

  getStruct(): ITrainingStruct {
    return {
      id: this.id,
      name: this.name,
      comment: this.comment,
      date: this.date,
      exercises: this.exercises.map((e) => e.getStruct()),
    };
  }
}
