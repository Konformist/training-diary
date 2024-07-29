import { IEntityStruct } from 'src/core/entities/EntityStruct';

/** Упражнение */
export interface TrainingExerciseStruct extends IEntityStruct {
  /** ID тренировки */
  training_id: number;
  /** ID упражнения */
  exercise_id: number;
  /** Количество подходов */
  approaches: number;
  /** Количество повторений */
  repetitions: number;
  /** Вес в подходе */
  weight: number;
  /** Время отдыха между подходами */
  rest_time: string;
  /** Связывание в суперсет со следующим */
  bind_next: number;
  /** Связывание в суперсет со предыдущим */
  bind_prev: number;
}
