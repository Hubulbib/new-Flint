import { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ContextFeature } from '../../features'
import { CardReportWidget } from '../../widgets'
import './report-detail.style.css'

export const ReportDetailPage = observer(() => {
  const { id } = useParams()
  const { reportStore } = useContext(ContextFeature)

  const navigate = useNavigate()
  if (!id) navigate('/report')

  useEffect(() => {
    const req = async () => {
      await reportStore.getById(id!)
    }
    req()
  }, [id])

  return (
    <div className={'report-detail-page'}>
      <CardReportWidget reportData={reportStore.report!} />
    </div>
  )
})
