import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { StageEnum } from '../../entities'
import { ContextFeature } from '../../features'
import { ButtonAColorShared, ETypeButton, InputWLabelShared, SelectWLabelShared } from '../../shared'
import './modal-stock.style.css'

export const ModalStockWidget = observer(
  ({ active, setActive }: { active: boolean; setActive: Dispatch<SetStateAction<boolean>> }) => {
    const { stockStore } = useContext(ContextFeature)

    const [vendorCode, setVendorCode] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [price, setPrice] = useState<number>()
    const [amount, setAmount] = useState<number>()
    const [quantity, setQuantity] = useState<string>('')
    const [type, setType] = useState<StageEnum[]>(['main' as StageEnum])

    const onClickCreateButton = async (e: { preventDefault: () => void }) => {
      e.preventDefault()
      await stockStore.create({ vendorCode, name, price: price!, amount: amount!, quantity, stage: type[0] })
      await stockStore.getAll()
      onClickCancelButton()
    }

    const onClickCancelButton = () => {
      setActive(false)
      setVendorCode('')
      setName('')
      setPrice(undefined)
      setAmount(undefined)
      setQuantity('')
      setType(['main' as StageEnum])
    }

    return (
      <div className={active ? 'modal-stock active' : 'modal-stock'}>
        <form className={'modal-stock__content'} onSubmit={onClickCreateButton}>
          <h1>Материал</h1>
          <InputWLabelShared value={vendorCode} setValue={setVendorCode} label={'Артикул'} />
          <InputWLabelShared value={name} setValue={setName} label={'Название'} />
          <InputWLabelShared value={price} type={'number'} setValue={setPrice} label={'Стоимость'} />
          <InputWLabelShared value={amount} type={'number'} setValue={setAmount} label={'Количество'} />
          <InputWLabelShared value={quantity} setValue={setQuantity} label={'Размер / Измерение'} />
          <SelectWLabelShared
            label={'Тип'}
            value={type}
            onChange={setType}
            optionList={Object.entries(StageEnum).map((el) => ({ value: el[0], text: el[1] }))}
          />
          <div className={'modal-stock__footer'}>
            <ButtonAColorShared
              text={'Создать'}
              disabled={!(vendorCode && name && price && amount && quantity)}
              type={ETypeButton.submit}
            />
            <ButtonAColorShared text={'Отменить'} onClick={onClickCancelButton} />
          </div>
        </form>
      </div>
    )
  },
)
