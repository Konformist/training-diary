/** Упражнение */
export interface IExerciseStruct {
  /** ID упражнения */
  id: number
  /** Название упражнения */
  name: string
  /** Мышечная группа */
  muscle_group: string
  /** Количество подходов */
  approaches: number
  /** Количество повторений */
  repetitions: number
  /** Вес в подходе */
  weight: number
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
  exercises: IExerciseStruct[]
}
