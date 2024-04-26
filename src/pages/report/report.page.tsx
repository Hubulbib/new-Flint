import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { ContextFeature } from '../../features'
import { GridTableWidget, IDataTable } from '../../widgets'
import { TitleShared } from '../../shared'
import './report.style.css'
import { useNavigate } from 'react-router-dom'

export const ReportPage = observer(() => {
  const navigate = useNavigate()
  const { reportStore } = useContext(ContextFeature)

  useEffect(() => {
    const req = async () => {
      await reportStore.getAll()
    }
    req().then(() => console.log(reportStore.reportList))
  }, [])

  const onClickGridItem = (data: IDataTable[]) => {
    navigate(`/report/${data[0]}`)
  }

  return (
    <div className={'report-page'}>
      <div className={'report-page__title'}>
        <TitleShared text={'Списания'} />
      </div>
      <GridTableWidget
        onClick={onClickGridItem}
        data={reportStore.reportList}
        columns={['ID', 'Котлы', 'Заказчик', 'Дата']}
      />
    </div>
  )
})
