import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '123-456-789' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

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

    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
    console.log('button clicked', event)
  }

  return (
    <div>
      <h2>Phonebook</h2>
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
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.name}>{person.name}: {person.number}</li>
        ))}
      </ul>
      <div>debug: {newName}</div>    
    </div>
  )
}

export default App