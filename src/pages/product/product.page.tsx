import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { PlusButtonShared, TitleShared } from '../../shared'
import { GridTableWidget, IDataTable } from '../../widgets'
import { ModalProductWidget } from '../../widgets'
import { ContextFeature } from '../../features'
import './product.style.css'

export const ProductPage = observer(() => {
  const { productStore } = useContext(ContextFeature)
  const [productId, setProductId] = useState<number>()
  const [modalProduct, setModalProduct] = useState<boolean>(false)

  useEffect(() => {
    const req = async () => {
      await productStore.getAll()
    }
    req()
  }, [])

  const onClickGridItem = (data: IDataTable[]) => {
    // @ts-ignore
    setProductId(data[0])
    setModalProduct(true)
  }

  return (
    <div className={'product-page'}>
      <div className={'product-page__title'}>
        <TitleShared text={'Продукция'} />
      </div>
      <div className={'product-page__btn'}>
        <PlusButtonShared onClick={() => setModalProduct(true)} />
      </div>
      <GridTableWidget
        onClick={onClickGridItem}
        data={productStore.productBase}
        columns={['ID', 'Название', 'Кол-во материала', 'Себестоимость']}
      />
      <ModalProductWidget
        //@ts-ignore
        setProductId={setProductId}
        //@ts-ignore
        productId={productId?.toString()}
        active={modalProduct}
        setActive={setModalProduct}
      />
    </div>
  )
})
