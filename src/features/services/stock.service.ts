import { invoke } from '@tauri-apps/api'
import { v4 } from 'uuid'
import { MaterialEntity } from '../../entities'
import { File } from '../dtos/file.class.ts'
import { EditMaterialDto } from '../dtos/edit-material.dto.ts'
import { CreateMaterialDto } from '../dtos/create-material.dto.ts'

export class StockService {
  static async create(createBodyDto: CreateMaterialDto): Promise<void> {
    const file: File = JSON.parse(await invoke('open_file'))

    file.material.push({ ...createBodyDto, price: +createBodyDto.price!, materialId: v4() })

    file.material.sort((a, b) => {
      if (a.materialId < b.materialId) return -1
      else if (a.materialId > b.materialId) return 1
      return 0
    })

    await invoke('set_file', { text: JSON.stringify({ ...file }) })
  }

  static async getAll(): Promise<MaterialEntity[]> {
    const file: File = JSON.parse(await invoke('open_file'))

    return file.material
  }

  static async getById(materialId: string): Promise<MaterialEntity> {
    const file: File = JSON.parse(await invoke('open_file'))

    return file.material[this.binSearch(file.material, materialId, 0, file.material.length - 1)]
  }

  static async edit(materialId: string, editBodyDto: EditMaterialDto) {
    const file: File = JSON.parse(await invoke('open_file'))

    const index = this.binSearch(file.material, materialId, 0, file.material.length - 1)

    if (index === -1) throw Error('Такого материала не существует')

    file.material[index] = { ...file.material[index], ...editBodyDto, price: +editBodyDto.price! }

    await invoke('set_file', { text: JSON.stringify({ ...file }) })
  }

  static async delete(materialId: string) {
    const file: File = JSON.parse(await invoke('open_file'))

    const index = this.binSearch(file.material, materialId, 0, file.material.length - 1)

    if (index === -1) throw Error('Такого материала не существует')

    file.material.splice(index, 1)

    await invoke('set_file', { text: JSON.stringify({ ...file }) })
  }

  public static binSearch(arr: MaterialEntity[], materialId: string, start: number, end: number): number {
    if (start > end) return -1

    let mid = Math.floor((start + end) / 2)

    if (arr[mid].materialId === materialId) return mid

    if (arr[mid].materialId > materialId) return this.binSearch(arr, materialId, start, mid - 1)
    else return this.binSearch(arr, materialId, mid + 1, end)
  }
}
