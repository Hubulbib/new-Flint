import './select-wlabel.style.css'

export const SelectWLabelShared = ({
  value,
  onChange,
  label = '',
  optionList = [],
  disabled = false,
  multiple = false,
}: {
  value: string | number | string[]
  onChange: Function
  label?: string
  optionList?: { value: string | number; text: string | number }[]
  disabled?: boolean
  multiple?: boolean
}) => {
  return (
    <div className={'select-wlabel'}>
      <label>{label}</label>
      <select
        multiple={multiple}
        disabled={disabled}
        value={value}
        onChange={(e) => {
          const options = [...e.target.selectedOptions]
          const values = options.map((option) => option.value)
          onChange(values)
        }}
      >
        {optionList.map((el) => (
          <option key={el.value} value={el.value}>
            {el.text}
          </option>
        ))}
      </select>
    </div>
  )
}
