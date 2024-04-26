import { boilerImage, boxImage, calculatorImage, reportImage } from '../../shared'
import './navbar.style.css'
import { NavLink } from 'react-router-dom'

export const NavbarWidget = () => {
  return (
    <div className={'nav-bar'}>
      <NavLink to={'/stock'}>
        <img src={boxImage} alt={'Склад'} />
      </NavLink>
      <NavLink to={'/product'}>
        <img src={boilerImage} alt={'Продукция'} />
      </NavLink>
      <NavLink to={'/calculator'}>
        <img src={calculatorImage} alt={'Расчет'} />
      </NavLink>
      <NavLink to={'/report'}>
        <img src={reportImage} alt={'Списания'} />
      </NavLink>
    </div>
  )
}
