export interface IEntityStruct {
  id: number
  name: string
}

export type TEntityModel<T extends IEntityStruct> = { getStruct(): T }&{ [Property in keyof T]: T[Property] }
