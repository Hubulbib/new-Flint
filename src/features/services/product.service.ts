import { invoke } from '@tauri-apps/api'
import { v4 } from 'uuid'
import { File } from '../dtos/file.class.ts'
import { ProductEntity } from '../../entities'
import { CreateProductDto } from '../dtos/create-product.dto.ts'
import { EditProductDto } from '../dtos/edit-product.dto.ts'
import { StockService } from './stock.service.ts'

export class ProductService {
  static async create(createBodyDto: CreateProductDto): Promise<void> {
    const file: File = JSON.parse(await invoke('open_file'))

    file.product.push({ ...createBodyDto, productId: v4() })

    file.product[file.product.length - 1].materials.sort((a, b) => {
      if (a.material.name < b.material.name) return -1
      else if (a.material.name > b.material.name) return 1
      return 0
    })

    file.product.sort((a, b) => {
      if (a.productId < b.productId) return -1
      else if (a.productId > b.productId) return 1
      return 0
    })

    await invoke('set_file', { text: JSON.stringify({ ...file }) })
  }

  static async getAll(): Promise<ProductEntity[]> {
    const file: File = JSON.parse(await invoke('open_file'))

    return file.product
  }

  static async getById(productId: string): Promise<ProductEntity> {
    const file: File = JSON.parse(await invoke('open_file'))

    return file.product[this.binSearch(file.product, productId, 0, file.product.length - 1)]
  }

  static async edit(productId: string, editBodyDto: EditProductDto) {
    const file: File = JSON.parse(await invoke('open_file'))

    const index = this.binSearch(file.product, productId, 0, file.product.length - 1)

    console.log(editBodyDto, { ...file.product[index], ...editBodyDto })

    if (index === -1) throw Error('Такого материала не существует')

    // @ts-ignore
    file.product[index] = {
      ...file.product[index],
      ...editBodyDto,
      materials: await Promise.all(
        editBodyDto.material!.map(async (el) => ({
          amount: el.amount,
          material: await StockService.getById(el.materialId),
        })),
      ),
    }

    file.product[index].materials.sort((a, b) => {
      if (a.material.name < b.material.name) return -1
      else if (a.material.name > b.material.name) return 1
      return 0
    })

    await invoke('set_file', { text: JSON.stringify({ ...file }) })
  }

  static async delete(productId: string) {
    const file: File = JSON.parse(await invoke('open_file'))

    const index = this.binSearch(file.product, productId, 0, file.product.length - 1)

    if (index === -1) throw Error('Такого котла не существует')

    file.product.splice(index, 1)

    await invoke('set_file', { text: JSON.stringify({ ...file }) })
  }

  public static binSearch(arr: ProductEntity[], productId: string, start: number, end: number): number {
    if (start > end) return -1

    let mid = Math.floor((start + end) / 2)

    if (arr[mid].productId === productId) return mid

    if (arr[mid].productId > productId) return this.binSearch(arr, productId, start, mid - 1)
    else return this.binSearch(arr, productId, mid + 1, end)
  }
}
