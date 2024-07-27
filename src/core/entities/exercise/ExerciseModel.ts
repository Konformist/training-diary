import EntityModel from 'src/core/entities/EntityModel';
import { TEntityModel } from 'src/core/entities/EntityStruct';
import { IExerciseStruct } from 'src/core/entities/exercise/ExerciseStruct';

export default class ExerciseModel extends EntityModel implements TEntityModel<IExerciseStruct> {
  equipment_id: number;

  muscle_group_id: number;

  constructor(struct?: IExerciseStruct) {
    super(struct);
    this.muscle_group_id = struct?.muscle_group_id ?? 0;
    this.equipment_id = struct?.equipment_id ?? 0;
  }

  getStruct() {
    return {
      ...super.getStruct(),
      muscle_group_id: this.muscle_group_id,
      equipment_id: this.equipment_id,
    };
  }
}
