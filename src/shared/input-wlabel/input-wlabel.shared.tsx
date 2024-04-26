import { Dispatch, SetStateAction } from 'react'
import './input-wlabel.style.css'

interface IInputWLabel<T> {
  label?: string
  placeholder?: string
  type?: string
  style?: object
  disabled?: boolean
  value: T
  setValue: Dispatch<SetStateAction<T>>
}

export const InputWLabelShared = <T extends string | number | readonly string[] | undefined>({
  label = '',
  placeholder = '',
  type = 'text',
  style,
  value,
  setValue,
  disabled = false,
}: IInputWLabel<T>) => {
  return (
    <div style={style} className={'input-wlabel'}>
      <label>{label}</label>
      <input
        disabled={disabled}
        placeholder={placeholder}
        type={type}
        value={value}
        // @ts-ignore
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
