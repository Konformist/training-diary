import EntityModel from '@/core/entities/EntityModel'
import { TEntityModel } from '@/core/entities/EntityStruct'
import { IMuscleStruct } from '@/core/entities/muscle/MuscleStruct'

export default class MuscleModel extends EntityModel implements TEntityModel<IMuscleStruct> {
  getStruct () {
    return super.getStruct()
  }
}
