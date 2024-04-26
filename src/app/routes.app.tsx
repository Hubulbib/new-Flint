import { Navigate, Route, Routes } from 'react-router-dom'
import { CalculatorPage, ProductPage, ReportDetailPage, ReportPage, StockPage } from '../pages'

export const RoutesApp = () => {
  return (
    <Routes>
      <Route path={'/stock'} element={<StockPage />} />
      <Route path={'/product'} element={<ProductPage />} />
      <Route path={'/calculator'} element={<CalculatorPage />} />
      <Route path={'/report'} element={<ReportPage />} />
      <Route path={'/report/:id'} element={<ReportDetailPage />} />
      <Route path={'*'} element={<Navigate to={'stock'} />} />
    </Routes>
  )
}
