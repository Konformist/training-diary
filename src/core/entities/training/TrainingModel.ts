/* eslint-disable no-underscore-dangle */
import EntityModel from '@/core/entities/EntityModel'
import { TEntityModel } from '@/core/entities/EntityStruct'
import { ITrainingStruct } from '@/core/entities/training/TrainingStruct'

export default class TrainingModel extends EntityModel implements TEntityModel<ITrainingStruct> {
  tag_id: number

  date: number

  comment: string

  constructor (struct?: ITrainingStruct) {
    super(struct)
    this.tag_id = struct?.tag_id ?? 0
    this.date = struct?.date ?? (new Date()).getTime()
    this.comment = struct?.comment ?? ''
  }

  getStruct () {
    return {
      ...super.getStruct(),
      tag_id: this.tag_id,
      date: this.date,
      comment: this.comment,
    }
  }
}
