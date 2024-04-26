import { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { v4 } from 'uuid'
import { ProductEntity } from '../../entities'
import { ButtonAColorShared, InputWLabelShared, SelectWLabelShared, TitleShared } from '../../shared'
import { ContextFeature, ECheck } from '../../features'
import './calculator.style.css'

type TBoiler = { product: ProductEntity; amount: number; id: string }

export const CalculatorPage = observer(() => {
  const { productStore, calculatorStore } = useContext(ContextFeature)

  const [boilerList, setBoilerList] = useState<TBoiler[]>([])
  const [product, setProduct] = useState<string[]>([])
  const [buyer, setBuyer] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)

  useEffect(() => {
    const req = async () => {
      await productStore.getAll()
      setProduct([productStore.productBase[0][0] as string])
    }
    req()
  }, [])

  useEffect(() => {}, [calculatorStore.isCheck])

  useEffect(() => {
    calculatorStore.setIsCheck(ECheck.failed)
    calculatorStore.setProblemList([])
  }, [JSON.stringify(boilerList)])

  const onClickCheckButton = async () => {
    await calculatorStore.check(boilerList?.map((el) => new Array(+el.amount).fill(el.product.productId)).flat() || [])
  }

  const onClickWriteOffButton = async () => {
    if (calculatorStore.isCheck === ECheck.failed) return
    await calculatorStore.writeOff(
      boilerList?.map((el) => new Array(+el.amount).fill(el.product.productId)).flat() || [],
      buyer,
    )
    setBoilerList([])
    setBuyer('')
    setAmount(0)
  }

  const viewTotalReport = () => {
    const total = new Map<string, number>()
    calculatorStore.problemList.forEach((el) => {
      el.data.forEach((el2) => {
        if (!total.has(el2.name)) total.set(el2.name, 0)
        total.set(el2.name, total.get(el2.name)! + el2.amount)
      })
    })
    const totalList = []
    for (const i of total.entries()) totalList.push({ name: i[0], amount: i[1] })

    return (
      <li>
        <h1 style={{ color: 'red' }}>Общее кол-во недостающих материалов</h1>
        {totalList.map((el) => (
          <h1 style={{ paddingLeft: '50px' }}>
            {el.name} - {el.amount}шт
          </h1>
        ))}
      </li>
    )
  }

  const onClickAddButton = async () => {
    await productStore.getById(product[0])
    setBoilerList([...boilerList!, { product: productStore.product!, id: v4(), amount }])
  }

  return (
    <div className={'calculator-page'}>
      <div className={'calculator-page__title'}>
        <TitleShared text={'Калькулятор'} />
      </div>
      <div className={'calculator-page__content'}>
        <div className={'modal-product__new'}>
          <SelectWLabelShared
            value={product}
            onChange={setProduct}
            label={'Продукт'}
            optionList={productStore.productBase.map((el) => ({ value: el[0], text: el[1] }))}
          />
          <InputWLabelShared type={'text'} value={amount} setValue={setAmount} label={'Кол-во'} />
          <ButtonAColorShared
            disabled={!(product && amount > 0)}
            style={{ backgroundColor: '#006944' }}
            text={'Добавить'}
            onClick={onClickAddButton}
          />
        </div>
        <div className={'calculator-page__content__boiler-list'}>
          {boilerList?.map((el) => (
            <h1 key={el.id} onDoubleClick={() => setBoilerList(boilerList.filter((el2) => el2.id !== el.id))}>
              {el.product.name} - x{el.amount}
            </h1>
          ))}
        </div>
        <InputWLabelShared type={'text'} value={buyer} setValue={setBuyer} label={'Заказчик'} />
        <ButtonAColorShared text={'Проверить'} onClick={onClickCheckButton} />
        {calculatorStore.isCheck === ECheck.failed ? (
          <>
            <ul>
              {calculatorStore.problemList.map((el) => (
                <li>
                  <h1 style={{ color: '#0062FF' }}>Для производства "{el.name}" не хватает:</h1>
                  {el.data.map((el2) => (
                    <h1 style={{ paddingLeft: '50px' }}>
                      {el2.name} - {el2.amount} шт
                    </h1>
                  ))}
                </li>
              ))}
              {calculatorStore.problemList.length > 1 ? viewTotalReport() : null}
            </ul>
          </>
        ) : (
          <ButtonAColorShared
            onDoubleClick={onClickWriteOffButton}
            text={'Списать'}
            disabled={!(boilerList.length && buyer)}
          />
        )}
      </div>
    </div>
  )
})
