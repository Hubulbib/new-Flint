import { invoke } from '@tauri-apps/api'
import { v4 } from 'uuid'
import { File } from '../dtos/file.class.ts'
import { ReportEntity, IReport } from '../../entities'

export class ReportService {
  static async write(productList: IReport, buyer: string): Promise<ReportEntity[]> {
    const file: File = JSON.parse(await invoke('open_file'))

    file.report.push({ reportId: v4(), createdAt: new Date(), productList, buyer })

    file.report.sort((a, b) => {
      if (a.reportId < b.reportId) return -1
      else if (a.reportId > b.reportId) return 1
      return 0
    })

    return file.report
  }

  static async getAll(): Promise<ReportEntity[]> {
    const file: File = JSON.parse(await invoke('open_file'))

    return file.report
  }

  static async getById(reportId: string): Promise<ReportEntity> {
    const file: File = JSON.parse(await invoke('open_file'))

    return file.report[this.binSearch(file.report, reportId, 0, file.report.length - 1)]
  }

  static async delete(reportId: string): Promise<void> {
    const file: File = JSON.parse(await invoke('open_file'))

    const index = this.binSearch(file.report, reportId, 0, file.report.length - 1)

    if (index === -1) throw Error('Такого списания не существует')

    for (const i in file.report[index].productList) {
      file.report[index].productList[i].forEach((el) => {
        for (const j in file.material) {
          if (file.material[j].name === el.name) {
            file.material[j] = { ...file.material[j], amount: file.material[j].amount + +el.amount }
            break
          }
        }
        return el
      })
    }

    file.report.splice(index, 1)

    await invoke('set_file', { text: JSON.stringify({ ...file }) })
  }

  private static binSearch(arr: ReportEntity[], reportId: string, start: number, end: number): number {
    if (start > end) return -1

    let mid = Math.floor((start + end) / 2)

    if (arr[mid].reportId === reportId) return mid

    if (arr[mid].reportId > reportId) return this.binSearch(arr, reportId, start, mid - 1)
    else return this.binSearch(arr, reportId, mid + 1, end)
  }
}
