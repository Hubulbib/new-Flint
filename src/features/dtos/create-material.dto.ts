import { StageEnum } from '../../entities'

export class CreateMaterialDto {
  constructor(
    readonly vendorCode: string,
    readonly name: string,
    readonly price: number,
    readonly amount: number,
    readonly quantity: string,
    readonly stage: StageEnum,
  ) {}
}
