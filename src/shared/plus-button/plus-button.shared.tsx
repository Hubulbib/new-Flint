import './plus-button.style.css'

export const PlusButtonShared = ({ onClick }: { onClick: any }) => {
  return (
    <button className={'plus-button'} onClick={onClick}>
      +
    </button>
  )
}
