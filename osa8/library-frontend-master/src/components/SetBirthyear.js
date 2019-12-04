import React, { useState } from 'react'
import Select from 'react-select'

const SetBirthyear = (props) => {
    const genericYear = 1950
    const [currentYear, setCurrentYear]=useState(genericYear)
    const [selected, setSelected]=useState('...')
    const [options,setOptions]=useState([])

    const toggleStyle = (testi) => {
      return {display: testi===false ? 'none' : ''}
    }

    const updateAuthor = async (event) => {
      event.preventDefault()

      await props.props.changeBirthyear({variables: {name:selected,setBornTo:currentYear}})

      console.log( {variables: {name:selected,born:currentYear}})
    }

    if(props.authors.length!==options.length){
      setOptions(props.authors.map((author,index) =>({value:index, label:author.name, born:author.born})))
    }

    const handleChange = (event) => {
      setSelected(options[event.value].label)
      if(options[event.value].born!==null){
        setCurrentYear(options[event.value].born)
      }
      else setCurrentYear(genericYear)
    }

    const handleInput = (event) => {
      if(parseInt(event.target.value)<2100)setCurrentYear(parseInt(event.target.value))
      else if(event.target.value==='')setCurrentYear('')
    }

    return(
      <div style={toggleStyle(props.props.token!=='')}>
        <h3>Set birthyear for {selected}</h3>
        <Select
          options={options}
          onChange={handleChange}
        />
        <form onSubmit={updateAuthor}>
        born <input value={currentYear} onChange={handleInput}/>
        <button type="submit">update author</button>
        </form>
      </div>
    ) 
}
export default SetBirthyear