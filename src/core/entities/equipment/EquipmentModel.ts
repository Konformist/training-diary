import EntityModel from '@/core/entities/EntityModel'
import { TEntityModel } from '@/core/entities/EntityStruct'
import { IEquipmentStruct } from '@/core/entities/equipment/EquipmentStruct'

export default class EquipmentModel extends EntityModel implements TEntityModel<IEquipmentStruct> {
  getStruct () {
    return super.getStruct()
  }
}
