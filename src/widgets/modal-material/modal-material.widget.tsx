import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ContextFeature } from '../../features'
import { StageEnum } from '../../entities'
import { ButtonAColorShared, ETypeButton, InputWLabelShared, SelectWLabelShared } from '../../shared'

export const ModalMaterialWidget = observer(
  ({
    active,
    setActive,
    materialId,
  }: {
    materialId: string
    active: boolean
    setActive: Dispatch<SetStateAction<boolean>>
  }) => {
    const { stockStore } = useContext(ContextFeature)

    const [vendorCode, setVendorCode] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<number>()
    const [amount, setAmount] = useState<number>()
    const [quantity, setQuantity] = useState<string>('')
    const [type, setType] = useState<StageEnum[]>([StageEnum.main])

    useEffect(() => {
      const req = async () => {
        await stockStore.getById(materialId)
        setVendorCode(stockStore.material?.vendorCode!)
        setName(stockStore.material?.name!)
        setPrice(stockStore.material?.price!)
        setAmount(stockStore.material?.amount!)
        setQuantity(stockStore.material?.quantity!)
        setType([stockStore.material?.stage!])
      }
      req()
    }, [materialId])

    const onClickEditButton = async (e: { preventDefault: () => void }) => {
      e.preventDefault()
      await stockStore.edit(materialId, { vendorCode, name, amount, price, stage: type[0], quantity })
      await stockStore.getAll()
      setActive(false)
    }

    const onClickDeleteButton = async () => {
      await stockStore.delete(materialId)
      await stockStore.getAll()
      setActive(false)
    }

    return (
      <div className={active ? 'modal-stock active' : 'modal-stock'}>
        <form className={'modal-stock__content'} onSubmit={onClickEditButton}>
          <h1>Материал</h1>
          <InputWLabelShared<string> value={vendorCode} setValue={setVendorCode} label={'Артикул'} />
          <InputWLabelShared<string> value={name} setValue={setName} label={'Название'} />
          <InputWLabelShared value={price} setValue={setPrice} label={'Стоимость'} />
          <InputWLabelShared value={amount} setValue={setAmount} label={'Количество'} />
          <InputWLabelShared<string> value={quantity} setValue={setQuantity} label={'Размер / Измерение'} />
          <SelectWLabelShared
            label={'Тип'}
            value={type}
            onChange={setType}
            optionList={Object.entries(StageEnum).map((el) => ({ value: el[0], text: el[1] }))}
          />
          <div className={'modal-stock__footer'}>
            <ButtonAColorShared
              text={'Сохранить'}
              disabled={!(vendorCode && name && price && amount && quantity)}
              type={ETypeButton.submit}
            />

            <ButtonAColorShared
              style={{ backgroundColor: '#e5871b' }}
              text={'Отменить'}
              onClick={() => setActive(!active)}
            />
          </div>
          <ButtonAColorShared type={ETypeButton.button} text={'Удалить'} onDoubleClick={onClickDeleteButton} />
        </form>
      </div>
    )
  },
)
