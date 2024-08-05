import { IEntityStruct } from '@/core/entities/EntityStruct'

/** Тренировка */
export interface ITrainingStruct extends IEntityStruct {
  /** Метка тренировки */
  tag_id: number
  /** Дата тренировки Timestamp */
  date: number
  /** Комментарий к тренировке */
  comment: string
}
