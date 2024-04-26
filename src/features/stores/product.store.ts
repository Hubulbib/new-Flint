import { makeAutoObservable } from 'mobx'
import { ProductService } from '../services/product.service.ts'
import { EditProductDto } from '../dtos/edit-product.dto.ts'
import { StockService } from '../services/stock.service.ts'
import { ProductEntity } from '../../entities'

type ProductBase = Array<Array<number | string>>

export class ProductStore {
  productBase: ProductBase = []
  product: ProductEntity | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setProductBase = (productBase: ProductBase) => {
    this.productBase = productBase
  }

  setProduct = (product: ProductEntity) => {
    this.product = product
  }

  getAll = async () => {
    try {
      const data = await ProductService.getAll()
      this.setProductBase(
        data.map((el) => [
          el.productId,
          el.name,
          el.materials.length,
          el.materials.reduce((acc, el) => acc + +el.material.price * el.amount, 0).toFixed(2),
        ]),
      )
    } catch (err) {
      throw err
    }
  }

  getById = async (productId: string) => {
    try {
      const data = await ProductService.getById(productId)
      this.setProduct(data)
    } catch (err) {
      throw err
    }
  }

  create = async (createBodyDto: { name: string; materials: { materialId: string; amount: number }[] }) => {
    try {
      await ProductService.create({
        name: createBodyDto.name,
        materials: await Promise.all(
          createBodyDto.materials.map(async (el) => ({
            material: await StockService.getById(el.materialId),
            amount: el.amount,
          })),
        ),
      })
    } catch (err) {
      throw err
    }
  }

  edit = async (productId: string, editBodyDto: EditProductDto) => {
    try {
      await ProductService.edit(productId, editBodyDto)
    } catch (err) {
      throw err
    }
  }

  delete = async (productId: string) => {
    try {
      await ProductService.delete(productId)
    } catch (err) {
      throw err
    }
  }
}
