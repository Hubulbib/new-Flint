import { makeAutoObservable } from 'mobx'
import { CalculatorService } from '../services/calculator.service.ts'

export enum ECheck {
  'failed' = 0,
  'complete' = 1,
}

type TProblem = { name: string; data: { name: string; amount: number }[] }

export class CalculatorStore {
  isCheck: ECheck = ECheck.failed
  problemList: TProblem[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setIsCheck = (isCheck: ECheck) => {
    this.isCheck = isCheck
  }

  setProblemList = (problemList: TProblem[]) => {
    this.problemList = problemList
  }

  check = async (productList: string[]) => {
    try {
      const data = await CalculatorService.check(productList)
      if (Object.values(data).length) {
        this.setIsCheck(ECheck.failed)
        const problem: TProblem[] = []
        for (let i in data) {
          problem.push({ name: i, data: data[i] })
        }
        this.setProblemList(problem)
      } else this.setIsCheck(ECheck.complete)
    } catch (err) {
      throw err
    }
  }

  writeOff = async (productList: string[], buyer: string) => {
    try {
      if (this.isCheck === ECheck.complete) {
        await CalculatorService.writeOff(productList, buyer)
      }
    } catch (err) {
      throw err
    }
  }
}
