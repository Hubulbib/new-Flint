import { makeAutoObservable } from 'mobx'
import { StockService } from '../services/stock.service.ts'
import { CreateMaterialDto } from '../dtos/create-material.dto.ts'
import { EditMaterialDto } from '../dtos/edit-material.dto.ts'
import { MaterialEntity } from '../../entities'

type StockBase = Array<Array<number | string>>

export class StockStore {
  stockBase: StockBase = []
  material: MaterialEntity | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setStockBase = (stockBase: StockBase) => {
    this.stockBase = stockBase
  }

  setMaterial = (material: MaterialEntity) => {
    this.material = material
  }

  getAll = async () => {
    try {
      const data = await StockService.getAll()
      this.setStockBase(
        data.map((el) => [el.materialId, el.vendorCode, el.name, el.price, el.amount, el.quantity, el.stage]),
      )
    } catch (err) {
      throw err
    }
  }

  getById = async (materialId: string) => {
    try {
      const data = await StockService.getById(materialId)
      this.setMaterial(data)
    } catch (err) {
      throw err
    }
  }

  create = async (createBodyDto: CreateMaterialDto) => {
    try {
      await StockService.create(createBodyDto)
    } catch (err) {
      throw err
    }
  }

  edit = async (materialId: string, editBodyDto: EditMaterialDto) => {
    try {
      await StockService.edit(materialId, editBodyDto)
    } catch (err) {
      throw err
    }
  }

  delete = async (materialId: string) => {
    try {
      await StockService.delete(materialId)
    } catch (err) {
      throw err
    }
  }
}
