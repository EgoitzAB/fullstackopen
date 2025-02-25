import { useEffect, useState } from 'react'
import rest from './services/rest'


const Notification = ({message, type}) => {
  
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }



  return (
    <div className="error" style={notificationStyle}>
      {message}
    </div>
  )
}


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


const Persons = ({filteredPersons, handleDelete}) => {
  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.id}>{person.name}: {person.number}
        <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
        </li>
      ))}
    </ul>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searching, setSearching] = useState('')
  const [notification, setNotification] = useState({ message: null, type: '' })

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

  const handleNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: '' }), 5000);
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
      if (window.confirm(`${newName} ya existe en la agenda telefónica, quieres actualizar el número?`)) {
      const person = existingPersons[0];
      const changedPerson = {...person, number: newNumber};
      rest.update(person.id, changedPerson).then(response => {
        setPersons(persons.map(p => p.id !== person.id ? p : response))
        handleNotification(`Updated ${newName}`, 'success');
        setNewName('')
        setNewNumber('')
      }).catch(error => {
        if (error.response && error.response.status === 404) {
        handleNotification(`Information of ${newName} has already been removed from server`, 'error')
        setPersons(persons.filter(p => p.id !== person.id))
      } else {
        handleNotification(error.response.data.error, 'error')
        }
      })
    }
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
      handleNotification(`Added ${newName}`, 'success');
      setNewName('')
      setNewNumber('')
    })
    .catch(error => {
      handleNotification(error.response.data.error, 'error');
    })  
  }

  
  const handleDelete = (id, name) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${name}?`)) {
      rest.deletePerson(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
        handleNotification(`Deleted ${name}`, 'success');
      }).catch(error => {
        handleNotification(`Information of ${name} has already been removed from server`, 'error');
        setTimeout(() => {
          window.location.reload()
        }, 2000)
         })
  }}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type}/>
      <Filter searching={searching} handleFilter={handleFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete}/>
      <div>debug: {newName}</div>    
    </div>
  )

}

export default App