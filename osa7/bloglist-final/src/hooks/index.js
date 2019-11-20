import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')
  const onChange = (event) => {
    setValue(event.target.value)
  }
  const update = (result) => {
    setValue(result)
  }
  const reset = () => {
    setValue('')
  }
  const jsx = {
    type,
    value,
    onChange
  }
  return {
    jsx,
    value,
    update,
    reset
  }
}