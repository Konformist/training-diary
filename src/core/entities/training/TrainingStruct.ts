/** Упражнение */
export interface ITrainingExerciseStruct {
  /** ID упражнения */
  id: number
  /**
   * Название упражнения
   * @deprecated
   */
  name: string
  /** ID упражнения из списка */
  exercise_id: number
  /**
   * Мышечная группа
   * @deprecated
   */
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
  exercises: ITrainingExerciseStruct[]
}
