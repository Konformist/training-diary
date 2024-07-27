import { IEntityStruct } from 'src/core/entities/EntityStruct';

/** Упражнение */
export interface ITrainingExerciseStruct extends IEntityStruct {
  /** ID тренировки */
  training_id: number
  /** ID упражнения */
  exercise_id: number
  /** Количество подходов */
  approaches: number
  /** Количество повторений */
  repetitions: number
  /** Вес в подходе */
  weight: number
  /** Связывание в суперсет со следующим */
  bind_next: number
  /** Связывание в суперсет со предыдущим */
  bind_prev: number
}

/** Тренировка */
export interface ITrainingStruct extends IEntityStruct {
  /** Метка тренировки */
  tag_id: number
  /** Дата тренировки Timestamp */
  date: number
  /** Комментарий к тренировке */
  comment: string
}
