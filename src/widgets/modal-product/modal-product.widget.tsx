import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { observer } from 'mobx-react-lite'
import { ButtonAColorShared, ETypeButton, InputWLabelShared, SelectWLabelShared } from '../../shared'
import { MaterialEntity, StageEnum } from '../../entities'
import { ContextFeature } from '../../features'
import { CardMaterialWidget } from '../../widgets'
import './modal-product.style.css'

type TProductMat = { material: MaterialEntity; amount: number; id: string }

export const ModalProductWidget = observer(
  ({
    active,
    setActive,
    setProductId,
    productId,
  }: {
    active: boolean
    setActive: Dispatch<SetStateAction<boolean>>
    setProductId: Dispatch<SetStateAction<number>>
    productId: string
  }) => {
    const { productStore, stockStore } = useContext(ContextFeature)

    const [name, setName] = useState<string>('')
    const [material, setMaterial] = useState<string[]>([])
    const [amount, setAmount] = useState<number>(0)

    const [mainMat, setMainMat] = useState<TProductMat[]>([])
    const [componentMat, setComponentMat] = useState<TProductMat[]>([])
    const [standardMat, setStandardMat] = useState<TProductMat[]>([])
    const [auxiliaryMat, setAuxiliaryMat] = useState<TProductMat[]>([])

    useEffect(() => {
      const req = async () => {
        await productStore.getById(productId)
        setName(productStore.product?.name!)
        setMainMat(
          // @ts-ignore
          productStore.product?.materials.filter(
            (el) => StageEnum[el.material.stage as unknown as keyof typeof StageEnum] === StageEnum.main,
          ) || [],
        )
        setComponentMat(
          // @ts-ignore
          productStore.product?.materials.filter(
            (el) => StageEnum[el.material.stage as unknown as keyof typeof StageEnum] === StageEnum.component,
          ) || [],
        )
        setStandardMat(
          // @ts-ignore
          productStore.product?.materials.filter(
            (el) => StageEnum[el.material.stage as unknown as keyof typeof StageEnum] === StageEnum.standard,
          ) || [],
        )
        setAuxiliaryMat(
          // @ts-ignore
          productStore.product?.materials.filter(
            (el) => StageEnum[el.material.stage as unknown as keyof typeof StageEnum] === StageEnum.auxiliary,
          ) || [],
        )
      }
      req()
    }, [productId])

    useEffect(() => {
      setMainMat((prev) => prev.map((el) => ({ ...el, id: v4() })))
    }, [mainMat])
    useEffect(() => {
      setComponentMat((prev) => prev.map((el) => ({ ...el, id: v4() })))
    }, [componentMat])
    useEffect(() => {
      setStandardMat((prev) => prev.map((el) => ({ ...el, id: v4() })))
    }, [standardMat])
    useEffect(() => {
      setAuxiliaryMat((prev) => prev.map((el) => ({ ...el, id: v4() })))
    }, [auxiliaryMat])

    useEffect(() => {
      const req = async () => {
        await stockStore.getAll()
      }
      req().finally(() => setMaterial([stockStore.stockBase[0][0].toString()]))
    }, [])

    const onClickSaveButton = async (e: { preventDefault: () => void }) => {
      e.preventDefault()
      const data = {
        name,
        material: [
          ...mainMat.map((el) => ({ materialId: el.material.materialId, amount: el.amount })),
          ...componentMat.map((el) => ({ materialId: el.material.materialId, amount: el.amount })),
          ...standardMat.map((el) => ({ materialId: el.material.materialId, amount: el.amount })),
          ...auxiliaryMat.map((el) => ({ materialId: el.material.materialId, amount: el.amount })),
        ],
      }
      if (productId) await productStore.edit(productId, data)
      else {
        await productStore.create({ ...data, materials: data.material })
      }
      await productStore.getAll()
      setActive(!active)
      onClickCancelButton()
    }

    const onClickRemoveMaterial = (id: string, materialStage: StageEnum) => {
      const matStage = StageEnum[materialStage as unknown as keyof typeof StageEnum]
      console.log(id, materialStage)
      if (matStage === StageEnum.main) setMainMat((prevState) => prevState.filter((el) => el.id !== id))
      else if (matStage === StageEnum.component) setComponentMat((prevState) => prevState.filter((el) => el.id !== id))
      else if (matStage === StageEnum.standard) setStandardMat((prevState) => prevState.filter((el) => el.id !== id))
      else if (matStage === StageEnum.auxiliary) setAuxiliaryMat((prevState) => prevState.filter((el) => el.id !== id))
    }

    const onClickDeleteButton = async () => {
      await productStore.delete(productId)
      await productStore.getAll()
      setActive(false)
      onClickCancelButton()
    }

    const onClickCancelButton = () => {
      setMainMat([])
      setComponentMat([])
      setStandardMat([])
      setAuxiliaryMat([])
      setName('')
      setActive(!active)
      //@ts-ignore
      setProductId(undefined)
    }

    const onClickAddButton = async () => {
      await stockStore.getById(material[0])
      const matStage = StageEnum[stockStore.material?.stage as unknown as keyof typeof StageEnum]
      if (matStage === StageEnum.main)
        setMainMat((prevState) => [...prevState, { material: stockStore.material!, amount, id: v4() }])
      else if (matStage === StageEnum.component)
        setComponentMat((prevState) => [...prevState, { material: stockStore.material!, amount, id: v4() }])
      else if (matStage === StageEnum.standard)
        setStandardMat((prevState) => [...prevState, { material: stockStore.material!, amount, id: v4() }])
      else if (matStage === StageEnum.auxiliary)
        setAuxiliaryMat((prevState) => [...prevState, { material: stockStore.material!, amount, id: v4() }])
    }

    return (
      <div
        style={{ paddingTop: '50px', paddingBottom: '50px' }}
        className={active ? 'modal-stock active' : 'modal-stock'}
      >
        <form className={'modal-stock__content'} onSubmit={onClickSaveButton}>
          <h1>Котел</h1>
          <InputWLabelShared style={{ width: '50%' }} value={name} setValue={setName} label={'Название'} />
          <h1>Материалы</h1>
          <div className={'modal-product__new'}>
            <SelectWLabelShared
              value={material}
              onChange={setMaterial}
              label={'Материал'}
              optionList={stockStore.stockBase.map((el) => ({ value: el[0], text: el[2] }))}
            />
            <InputWLabelShared type={'text'} value={amount} setValue={setAmount} label={'Кол-во'} />
            <ButtonAColorShared
              disabled={!(material && amount > 0)}
              style={{ backgroundColor: '#006944' }}
              text={'Добавить'}
              onClick={onClickAddButton}
            />
          </div>
          <div className={'modal-product__mlist'}>
            <div>
              <h1>{StageEnum.main}</h1>
              {mainMat?.map((el) => (
                <CardMaterialWidget
                  key={el.material.materialId}
                  cardData={{ material: el.material, amount: el.amount, id: el.id }}
                  onDelete={onClickRemoveMaterial}
                />
              ))}
            </div>
            <div>
              <h1>{StageEnum.component}</h1>
              {componentMat?.map((el) => (
                <CardMaterialWidget
                  key={el.material.materialId}
                  cardData={{ material: el.material, amount: el.amount, id: el.id }}
                  onDelete={onClickRemoveMaterial}
                />
              ))}
            </div>
            <div>
              <h1>{StageEnum.standard}</h1>
              {standardMat?.map((el) => (
                <CardMaterialWidget
                  key={el.material.materialId}
                  cardData={{ material: el.material, amount: el.amount, id: el.id }}
                  onDelete={onClickRemoveMaterial}
                />
              ))}
            </div>
            <div>
              <h1>{StageEnum.auxiliary}</h1>
              {auxiliaryMat?.map((el) => (
                <CardMaterialWidget
                  key={el.material.materialId}
                  cardData={{ material: el.material, amount: el.amount, id: el.id }}
                  onDelete={onClickRemoveMaterial}
                />
              ))}
            </div>
          </div>
          <div className={'modal-stock__footer'}>
            <ButtonAColorShared text={'Сохранить'} disabled={!name} type={ETypeButton.submit} />
            <ButtonAColorShared
              style={{ backgroundColor: '#e5871b' }}
              text={'Отменить'}
              onClick={onClickCancelButton}
            />
            <ButtonAColorShared onDoubleClick={onClickDeleteButton} text={'Удалить'} />
          </div>
        </form>
      </div>
    )
  },
)
