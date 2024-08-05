import { IEntityStruct, TEntityModel } from '@/core/entities/EntityStruct'

export default abstract class EntityModel implements TEntityModel<IEntityStruct> {
  id: number

  name: string

  constructor (struct?: IEntityStruct) {
    this.id = struct?.id ?? 0
    this.name = struct?.name ?? ''
  }

  public getStruct () {
    return {
      id: this.id,
      name: this.name,
    }
  }
}
