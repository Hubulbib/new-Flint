export class EditProductDto {
  constructor(
    readonly name?: string,
    readonly material?: { materialId: string; amount: number }[],
  ) {}
}
