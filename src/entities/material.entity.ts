import { StageEnum } from './stage.enum.ts'

export class MaterialEntity {
  constructor(
    readonly materialId: string,
    readonly vendorCode: string,
    readonly name: string,
    readonly price: number,
    readonly amount: number,
    readonly quantity: string,
    readonly stage: StageEnum,
  ) {}
}
