import { invoke } from '@tauri-apps/api'
import { File } from '../dtos/file.class.ts'
import { ProductService } from './product.service.ts'
import { StockService } from './stock.service.ts'
import { IReport } from '../../entities'
import { ReportService } from './report.service.ts'

export class CalculatorService {
  static async check(productList: string[]): Promise<IReport> {
    const file: File = JSON.parse(await invoke('open_file'))

    const indexList: number[] = []
    productList.forEach((el) => indexList.push(ProductService.binSearch(file.product, el, 0, file.product.length - 1)))
    const report: IReport = {}
    const fileMat = [...file.material]
    indexList.forEach((ind) => {
      const materialIndexList: number[] = []
      file.product[ind].materials.forEach((mat) => {
        materialIndexList.push(StockService.binSearch(fileMat, mat.material.materialId, 0, fileMat.length - 1))
      })

      let i = 0
      file.product[ind].materials.forEach((mat) => {
        if (+mat.amount > +fileMat[materialIndexList[i]].amount) {
          if (report[file.product[ind]?.name]) {
            const matInd = report[file.product[ind]?.name].findIndex((el) => el.name === mat.material.name)
            if (matInd !== -1)
              report[file.product[ind].name][matInd].amount += +mat.amount - +fileMat[materialIndexList[i]].amount
            else
              report[file.product[ind].name].push({
                name: mat.material.name,
                amount: +mat.amount - +fileMat[materialIndexList[i]].amount,
              })
          } else {
            report[file.product[ind].name] = []
            report[file.product[ind].name].push({
              name: mat.material.name,
              amount: +mat.amount - +fileMat[materialIndexList[i]].amount,
            })
          }
          fileMat[materialIndexList[i]] = { ...fileMat[materialIndexList[i]], amount: 0 }
        } else {
          fileMat[materialIndexList[i]] = {
            ...fileMat[materialIndexList[i]],
            amount: fileMat[materialIndexList[i]].amount - +mat.amount,
          }
        }

        i++
      })
      /*file.product[ind].materials.forEach((mat) => {
        if (+mat.amount > +file.material[materialIndexList[i]].amount) {
          if (report[file.product[ind]?.name]) {
            const matInd = report[file.product[ind]?.name].findIndex((el) => el.name === mat.material.name)
            report[file.product[ind].name][matInd].amount += +mat.amount - +file.material[materialIndexList[i]].amount
          } else {
            report[file.product[ind].name] = []
            report[file.product[ind].name].push({
              name: mat.material.name,
              amount: +mat.amount - +file.material[materialIndexList[i]].amount,
            })
          }
        }
        i++
      })*/
    })

    return report
  }

  static async writeOff(productList: string[], buyer: string): Promise<void> {
    const file: File = JSON.parse(await invoke('open_file'))
    const report: IReport = {}

    const indexList: number[] = []
    productList.forEach((el) => indexList.push(ProductService.binSearch(file.product, el, 0, file.product.length - 1)))
    for (const el of indexList) {
      const product = file.product[el]
      product.materials.forEach((matEl) => {
        const materialIndex = StockService.binSearch(
          file.material,
          matEl.material.materialId,
          0,
          file.material.length - 1,
        )
        file.material[materialIndex] = {
          ...file.material[materialIndex],
          amount: +file.material[materialIndex].amount - +matEl.amount,
        }
        if (!report[product.name]) {
          report[product.name] = []
          report[product.name].push({ name: file.material[materialIndex].name, amount: +matEl.amount })
        } else {
          const matInd = report[product.name].findIndex((el) => el.name === file.material[materialIndex].name)
          if (matInd !== -1) report[product.name][matInd].amount = +report[product.name][matInd].amount + +matEl.amount
          else {
            report[product.name].push({ name: file.material[materialIndex].name, amount: +matEl.amount })
          }
        }
      })
    }

    const reportData = await ReportService.write(report, buyer)

    await invoke('set_file', { text: JSON.stringify({ ...file, report: reportData }) })
  }
}
