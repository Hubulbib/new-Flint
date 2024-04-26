import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PlusButtonShared, TitleShared } from '../../shared'
import { ContextFeature } from '../../features'
import { GridTableWidget, IDataTable, ModalMaterialWidget, ModalStockWidget } from '../../widgets'
import './stock.style.css'
import { StageEnum } from '../../entities'

export const StockPage = observer(() => {
  const { stockStore } = useContext(ContextFeature)
  const [modalStock, setModalStock] = useState<boolean>(false)
  const [modalMaterial, setModalMaterial] = useState<boolean>(false)
  const [materialId, setMaterialId] = useState<string>()

  useEffect(() => {
    const req = async () => {
      await stockStore.getAll()
    }
    req()
  }, [])

  const onClickGridItem = (data: IDataTable[]) => {
    // @ts-ignore
    setMaterialId(data[0])
    setModalMaterial(true)
  }

  return (
    <div className={'stock-page'}>
      <div className={'stock-page__title'}>
        <TitleShared text={'Склад'} />
      </div>
      <div className={'stock-page__btn'}>
        <PlusButtonShared onClick={() => setModalStock(true)} />
      </div>
      <GridTableWidget
        onClick={onClickGridItem}
        data={stockStore.stockBase.map((el) => [...el.slice(0, 6), StageEnum[el[6] as keyof typeof StageEnum]])}
        columns={['ID', 'Артикул', 'Название', 'Цена', 'Кол-во на складе', 'Размер / Измерение', 'Тип']}
      />
      <ModalStockWidget active={modalStock} setActive={setModalStock} />
      <ModalMaterialWidget materialId={materialId!} active={modalMaterial} setActive={setModalMaterial} />
    </div>
  )
})
