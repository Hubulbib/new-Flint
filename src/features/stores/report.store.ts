import { makeAutoObservable } from 'mobx'
import { ReportService } from '../services/report.service.ts'
import { ProductService } from '../services/product.service.ts'
import { IReport, ReportEntity } from '../../entities'
import { StockService } from '../services/stock.service.ts'

type ReportBase = Array<Array<number | string | Date>>
export type Report = ReportEntity & { boilerNameList: string[]; price: number }

export class ReportStore {
  reportList: ReportBase = []
  report: Report | null = null

  constructor() {
    makeAutoObservable(this)
  }

  setReportList = (reportList: ReportBase) => {
    this.reportList = reportList
  }

  setReport = (report: Report) => {
    this.report = report
  }

  getAll = async () => {
    try {
      this.setReportList([])
      const result: ReportBase = []
      const data = await ReportService.getAll()
      await Promise.all(
        data.map(async (el) => {
          const boilerNameList = await this.getBoilerNameList(el)
          result.push([el.reportId, boilerNameList.join(', '), el.buyer, this.printDate(el.createdAt)])
        }),
      )
      this.setReportList(result)
    } catch (err) {
      throw err
    }
  }

  getById = async (reportId: string) => {
    try {
      const data = await ReportService.getById(reportId)
      const boilerNameList = await this.getBoilerNameList(data)
      this.setReport({ ...data, boilerNameList, price: await this.getPrice(data.productList) })
    } catch (err) {
      throw err
    }
  }

  delete = async (reportId: string) => {
    try {
      await ReportService.delete(reportId)
    } catch (err) {
      throw err
    }
  }

  private getPrice = async (report: IReport) => {
    try {
      const material = await StockService.getAll()
      let result = 0
      for (const i in report) {
        report[i].map((el) => {
          result += material[material.findIndex((m) => m.name === el.name)].price * el.amount
          console.log(el.name, result)
        })
      }
      return result
    } catch (err) {
      throw err
    }
  }

  private getBoilerNameList = async (el: ReportEntity) => {
    const boilerAmount: { [key: string]: number } = {}
    for (const i in el.productList) {
      const boiler = (await ProductService.getAll()).find((b) => b.name === i)
      if (!boiler) break
      const materialOne = boiler.materials.find((mat) => mat.material.name === el.productList[i][0].name)
      if (!materialOne) break
      boilerAmount[boiler.name] = el.productList[i][0].amount / materialOne.amount
    }
    const boilerKeys = Object.keys(boilerAmount),
      boilerValues = Object.values(boilerAmount)
    const boilerNames: string[] = []
    for (let i = 0; i < boilerKeys.length; i++) {
      boilerNames[i] = boilerKeys[i] + ' - x' + boilerValues[i]
    }
    return boilerNames
  }

  private printDate = (createdAt: Date) => {
    const date = new Date(createdAt)
    return (
      date.getDate() +
      '.' +
      getMonth(date.getMonth() + 1) +
      '.' +
      date.getFullYear() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    )

    function getMonth(month: number): string {
      if (month >= 10) return month.toString()
      return '0' + month.toString()
    }
  }
}
