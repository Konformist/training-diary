import ExerciseModel from 'src/core/entities/training/ExerciseModel';
import { ITrainingStruct } from 'src/core/entities/training/TrainingStruct';

export default class TrainingModel implements ITrainingStruct {
  date: number;

  exercises: ExerciseModel[];

  constructor(struct?: ITrainingStruct) {
    this.date = struct?.date ?? (new Date()).getTime();
    this.exercises = (struct?.exercises ?? []).map((e) => new ExerciseModel(e));
  }

  getStruct() {
    return {
      date: this.date,
      exercises: this.exercises.map((e) => e.getStruct()),
    };
  }
}
