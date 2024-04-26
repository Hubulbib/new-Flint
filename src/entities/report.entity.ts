export interface IReport {
  [key: string]: { name: string; amount: number }[] // Material Array
}

export class ReportEntity {
  constructor(
    readonly reportId: string,
    readonly productList: IReport,
    readonly buyer: string,
    readonly createdAt: Date,
  ) {}
}
