import EntityModel from 'src/core/entities/EntityModel';
import { TEntityModel } from 'src/core/entities/EntityStruct';
import { IMuscleStruct } from 'src/core/entities/muscle/MuscleStruct';

export default class MuscleModel extends EntityModel implements TEntityModel<IMuscleStruct> {
  getStruct() {
    return super.getStruct();
  }
}
