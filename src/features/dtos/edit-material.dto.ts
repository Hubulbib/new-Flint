import { StageEnum } from '../../entities'

export class EditMaterialDto {
  constructor(
    readonly vendorCode?: string,
    readonly name?: string,
    readonly price?: number,
    readonly amount?: number,
    readonly quantity?: string,
    readonly stage?: StageEnum,
  ) {}
}
