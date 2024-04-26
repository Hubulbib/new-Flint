import { BrowserRouter } from 'react-router-dom'
import { calculatorStore, ContextFeature, productStore, reportStore, stockStore } from '../features'
import { NavbarWidget } from '../widgets'
import { RoutesApp } from './routes.app.tsx'

export const App = () => {
  return (
    <ContextFeature.Provider value={{ stockStore, productStore, calculatorStore, reportStore }}>
      <BrowserRouter>
        <div className={'app'}>
          <NavbarWidget />
          <div className={'routes-app'}>
            <RoutesApp />
          </div>
        </div>
      </BrowserRouter>
    </ContextFeature.Provider>
  )
}
