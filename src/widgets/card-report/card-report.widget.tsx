import React, { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { deleteImage } from '../../shared'
import { ContextFeature, Report } from '../../features'
import './card-report.style.css'
import { useNavigate } from 'react-router-dom'

export const CardReportWidget = observer(({ reportData }: { reportData: Report }) => {
  const { reportStore } = useContext(ContextFeature)
  const navigate = useNavigate()

  const [openDetail, setOpenDetail] = useState<boolean>(false)

  const onDoubleClickDeleteButton = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    await reportStore.delete(reportData.reportId)
    await reportStore.getAll()
    navigate('/report')
  }

  const printDate = () => {
    const date = new Date(reportData?.createdAt)
    return date.getDate() + '.' + getMonth(date.getMonth() + 1) + '.' + date.getFullYear()

    function getMonth(month: number): string {
      if (month >= 10) return month.toString()
      return '0' + month.toString()
    }
  }

  const printBoilerList = () => {
    const printData = []
    for (const i in reportData?.productList) {
      printData.push(
        <li>
          <h1>{i}: </h1>
          <ul style={{ marginLeft: '15px', listStyleType: 'none' }}>
            {reportData?.productList[i].map((el) => (
              <li>
                {el.name} - {el.amount}
              </li>
            ))}
          </ul>
        </li>,
      )
    }
    return printData
  }

  return (
    <div className="card-report">
      <div className="card-report__main" onClick={() => setOpenDetail(!openDetail)}>
        <h1 style={{ margin: 0 }}>{reportData?.boilerNameList.join(', ')}</h1>
        <h1 style={{ margin: 0 }}>{reportData?.buyer}</h1>
        <h1 style={{ margin: 0 }}>{printDate()}</h1>

        <div
          style={{ margin: 0 }}
          className={'card-report__btn'}
          onDoubleClick={onDoubleClickDeleteButton}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <img src={deleteImage} alt="удалить" />
        </div>
      </div>
      <div className={!openDetail ? 'card-report__detail' : '.card-report__detail active'}>
        <div className={!openDetail ? 'card-report__detail__form' : 'card-report__detail__form active'}>
          <div className="card-report__detail__field">
            <div>
              <h1>Заказчик: {reportData?.buyer}</h1>
            </div>
            <div>
              <h1>Дата заказа: {printDate()}</h1>
            </div>
            <ul style={{ listStyleType: 'none' }}>{printBoilerList()}</ul>
            <div>
              <h1>Себестоимость заказа: {reportData?.price}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
