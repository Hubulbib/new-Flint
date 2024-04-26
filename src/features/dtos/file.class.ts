import { MaterialEntity, ProductEntity, ReportEntity } from '../../entities'

export class File {
  constructor(
    readonly material: MaterialEntity[],
    readonly product: ProductEntity[],
    readonly report: ReportEntity[],
  ) {}
}
