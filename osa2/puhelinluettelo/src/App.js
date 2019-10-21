import React, { useState, useEffect } from 'react'
import noteService from './services/notes'

const PersonForm = (props) => {
  let newName = props.newName
  let newNumber = props.newNumber
  let persons = props.persons
  
  let setPersons   = props.setPersons
  let setNewName   = props.setNewName
  let setNewNumber = props.setNewNumber

  const UInollaus = () => {
    setNewName('')
    setNewNumber('')
    RefreshPersons(setPersons)
  }

  const addPerson = (event) =>{
    event.preventDefault()
    const personObject = {
        name:newName,
        number:newNumber
    }
    let personIndex = persons.map(person=>person.name).indexOf(newName)
    if( personIndex === -1 && newName !== ''){
        noteService
          .create(personObject)
          .then( () => {
            UInollaus()
          })
        errorIsHappening=0
        globalErrorFunc(`Added ${newName}`)
    }else{
        if(newName===''){
          errorIsHappening=1
          globalErrorFunc('Namefield is empty!')
        }else if( persons[personIndex].number === newNumber ){
          //alert(`${newName} is already added to phonebook`)
          errorIsHappening=1
          globalErrorFunc(`${newName} is already added to phonebook`)
          setNewName('')
          setNewNumber('')
        }else{
          errorIsHappening=0
          if( window.confirm(`${newName} numero päivitetään -> ${newNumber}`) ){
            noteService
            .update( persons[personIndex].id, personObject )
            .then( () => {
              UInollaus()
            })
            errorIsHappening=0
            globalErrorFunc(`The number of ${newName} has been updated`)
          }
        }
    }
  }

  const handleNameChange = (event) =>{
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value);
  }

  return (
    <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
    </form>
  )
}

const PrintPerson = (props) => {
  let person = props.person
  let setPersons = props.setPersons

  const deletionError = () => {
    errorIsHappening=1;
    globalErrorFunc(`Information of ${person.name} has already been removed from server`)
  }

  const deletionSuccess = () => {
    errorIsHappening=0;
    globalErrorFunc('Entry removal successful')
  }

  const deletePerson = () =>{
    if(window.confirm(`${person.name} poistetaan`))
    noteService.deleteEntry(person.id)
      .then( () => {
        RefreshPersons(setPersons)
        deletionSuccess() })
      .catch( () => {
        RefreshPersons(setPersons)
        deletionError()
      })
  }
  return(
    <>
    <li>
      {person.name} {person.number}
      <button onClick={deletePerson}>
        delete
      </button>
    </li>
    </>
  )
}

const Persons = (props) => {
    const persons = props.persons
    const searchString = props.searchString
    const setPersons = props.setPersons
    return (
        <>
        {persons.filter(person=>person.name.toUpperCase().search(searchString.toUpperCase())===0).map(person=><PrintPerson key={person.id} person={person} setPersons={setPersons}/>)}
        </>
    )
}

const Filter = (props) => {
  const handleSearch = (event) =>{
    props.setSearchString(event.target.value)
  }
  return(
    <div>
      filter shown with <input value={props.searchString} onChange={handleSearch} />
    </div>
  )
}

const RefreshPersons = (setFunc) => {
  noteService.getAll()
  .then( response => {
    setFunc(response.data)
  })
}

const ErrorMessages = ({message}) => {
  if( message === null ){
    errorIsHappening=0
    return null
  }
  setTimeout( ()=> {
    globalErrorFunc(null)
  },3000)
  let errorStyle="nonerror"
  if(errorIsHappening)errorStyle="error";
  return (
    <div className="errorContainer">
      <div className={errorStyle}>
        {message}<br/>
        Velhomeditaatio
      </div>
    </div>
  )
}

let globalErrorFunc,errorIsHappening

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ searchString, setSearchString ] = useState('')
  const [ errorMesasge, setErrorMessage ] = useState(null)

  useEffect( ()=>{
    RefreshPersons(setPersons)
  },[])

  globalErrorFunc = setErrorMessage

  return (
    
    <div>
      <ErrorMessages message={errorMesasge}/>
      <h2>Phonebook</h2>
      <Filter searchString={searchString} setSearchString={setSearchString} />
      <h3>Add new</h3>
      <PersonForm 
        newName   = {newName}
        newNumber = {newNumber}
        persons   = {persons}
        setPersons   = {setPersons}
        setNewName   = {setNewName}
        setNewNumber = {setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} searchString={searchString} setPersons={setPersons}/>
    </div>
  )

}

export default App