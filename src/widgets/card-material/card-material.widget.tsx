import React from 'react'
import { deleteImage } from '../../shared'
import { MaterialEntity, StageEnum } from '../../entities'
import './card-material.style.css'

export const CardMaterialWidget = ({
  cardData,
  onDelete,
}: {
  cardData: { material: MaterialEntity; amount: number; id: string }
  onDelete: (id: string, materialStage: StageEnum) => void
}) => {
  const onDoubleClickDeleteButton = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    onDelete(cardData.id, cardData.material.stage)
  }

  return (
    <div className="card-material">
      <div className="card-material__main">
        <h1 style={{ margin: 0 }}>{cardData.material.vendorCode}</h1>
        <h1 style={{ margin: 0 }}>{cardData.material.name}</h1>
        <h1 style={{ margin: 0 }}>{cardData.material.price}</h1>
        <h1 style={{ margin: 0 }}>{cardData.material.amount}</h1>
        <h1 style={{ margin: 0 }}>{cardData.material.quantity}</h1>
        <h1 style={{ margin: 0 }}>{cardData.amount}</h1>

        <div
          style={{ margin: 0 }}
          className={'card-material__btn'}
          onDoubleClick={onDoubleClickDeleteButton}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <img src={deleteImage} alt="удалить" />
        </div>
      </div>
    </div>
  )
}
