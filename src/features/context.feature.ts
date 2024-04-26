import { createContext } from 'react'
import { StockStore } from './stores/stock.store.ts'
import { ProductStore } from './stores/product.store.ts'
import { CalculatorStore } from './stores/calculator.store.ts'
import { ReportStore } from './stores/report.store.ts'

export const stockStore = new StockStore()
export const productStore = new ProductStore()
export const calculatorStore = new CalculatorStore()
export const reportStore = new ReportStore()

export const ContextFeature = createContext({
  stockStore,
  productStore,
  calculatorStore,
  reportStore,
})
