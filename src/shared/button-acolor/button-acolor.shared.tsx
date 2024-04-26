import './button-acolor.style.css'

interface IButtonAColor {
  text: string
  type?: ETypeButton
  disabled?: boolean
  onClick?: () => void | ((prev: boolean) => void) | (() => Promise<void>) | Promise<void>
  onDoubleClick?: () => void | (() => Promise<void>) | Promise<void>
  style?: object
}

export enum ETypeButton {
  button = 'button',
  submit = 'submit',
  reset = 'reset',
}

export const ButtonAColorShared = ({
  type = ETypeButton.button,
  disabled = false,
  text,
  onClick,
  onDoubleClick,
  style,
}: IButtonAColor) => {
  return (
    // @ts-ignore
    <button
      style={style}
      className={'button-acolor'}
      type={type}
      disabled={disabled}
      onDoubleClick={onDoubleClick}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
