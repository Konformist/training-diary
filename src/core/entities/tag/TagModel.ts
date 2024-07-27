import EntityModel from 'src/core/entities/EntityModel';
import { TEntityModel } from 'src/core/entities/EntityStruct';
import { ITagStruct } from 'src/core/entities/tag/TagStruct';

export default class TagModel extends EntityModel implements TEntityModel<ITagStruct> {
  color: number;

  constructor(struct?: ITagStruct) {
    super(struct);
    this.color = struct?.color ?? 0;
  }

  getStruct() {
    return {
      ...super.getStruct(),
      color: this.color,
    };
  }
}
