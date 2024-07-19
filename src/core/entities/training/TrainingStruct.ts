/** Упражнение */
export interface ITrainingExerciseStruct {
  /** ID упражнения */
  id: number
  /** ID упражнения из списка */
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
export interface ITrainingStruct {
  /** ID тренировки */
  id: number
  /** Название тренировки */
  name: string
  /** Комментарий к тренировке */
  comment: string
  /** Дата тренировки Timestamp */
  date: number
  /** Упражнения */
  exercises: ITrainingExerciseStruct[]
}
