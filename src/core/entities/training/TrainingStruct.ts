/** Упражнение */
export interface IExerciseStruct {
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
  /** Дата тренировки Timestamp */
  date: number
  /** Упражнения */
  exercises: IExerciseStruct[]
}
