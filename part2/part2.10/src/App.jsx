import { useEffect, useState } from 'react'
import axios from 'axios'
import rest from './services/rest'

const Filter = ({searching, handleFilter}) => {
  return (
    <div>
      filter shown with <input
      value={searching}
      onChange={handleFilter}/>
    </div>
  )
}


const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
          name: <input
          value={newName}
          onChange={handleNameChange}/>
      </div>
      <div>
        number: <input
        value={newNumber}
        onChange={handleNumberChange}/>
      </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}


const Persons = ({filteredPersons}) => {
  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.id}>{person.name}: {person.number}</li>
      ))}
    </ul>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searching, setSearching] = useState('')
  
  useEffect(() => {
    console.log('effect')
    rest.getAll()
      .then(initialNames => {
        console.log('Data recibida del servidor:', initialNames);
        console.log('promise fulfilled')
        setPersons(initialNames)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setSearching(event.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searching.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    if (newName.trim() === '' || newNumber.trim() === '') {
      alert('Por favor, introduce un nombre y un número');
      return;
    }

    const existingPersons = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase());
    const existingNumber = persons.filter(person => person.number === newNumber);

    if (existingPersons.length > 0) {
      alert(`${newName} ya existe en la agenda telefónica`);
      return;
    }
    
    if (existingNumber.length > 0) {
      alert(`${newNumber} ya existe en la agenda telefónica`);
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    rest.create(newPerson).then(response => {
      setPersons(persons.concat(response))
      setNewName('')
      setNewNumber('')
    }
    ).catch(error => {
      console.log(error)
    }
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searching={searching} handleFilter={handleFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons}/>
      <div>debug: {newName}</div>    
    </div>
  )
}

export default App