import EntityModel from 'src/core/entities/EntityModel';
import { TEntityModel } from 'src/core/entities/EntityStruct';
import { IEquipmentStruct } from 'src/core/entities/equipment/EquipmentStruct';

export default class EquipmentModel extends EntityModel implements TEntityModel<IEquipmentStruct> {
  getStruct() {
    return super.getStruct();
  }
}
