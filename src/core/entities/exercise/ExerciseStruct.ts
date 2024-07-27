import { IEntityStruct } from 'src/core/entities/EntityStruct';

/** Упражнение */
export interface IExerciseStruct extends IEntityStruct {
  /** ID мышцы */
  muscle_group_id: number
  /** ID экипировки */
  equipment_id: number
}
