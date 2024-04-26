import { MaterialEntity } from '../../entities'

export class CreateProductDto {
  constructor(
    readonly name: string,
    readonly materials: { material: MaterialEntity; amount: number }[],
  ) {}
}
