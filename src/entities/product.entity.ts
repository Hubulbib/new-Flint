import { MaterialEntity } from './material.entity.ts'

export class ProductEntity {
  constructor(
    readonly productId: string,
    readonly name: string,
    readonly materials: { material: MaterialEntity; amount: number }[],
  ) {}
}
