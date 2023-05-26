import { useState, useEffect } from 'react'

import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const emptyMessage = { message: '', type: '' }

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState(emptyMessage)

  // console.log('render')

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const handleAddPerson = (event) => {
    event.preventDefault()

    try {
      if (
        persons.some(
          (person) => person.name === newName && person.number === newNumber
        )
      ) {
        alert(`${newName} is already added to the phonebook`)
      } else if (
        persons.some(
          (person) => person.name === newName && person.number !== newNumber
        )
      ) {
        if (
          window.confirm(
            `${newName} is already added to the phonebook, replace the old number with a new one?`
          )
        ) {
          let personToFind = persons.find((person) => person.name === newName)
          const changedPerson = { ...personToFind, number: newNumber }
          personService
            .update(personToFind.id, changedPerson)
            .then((returnedPerson) => {
              setPersons(
                persons.map((person) =>
                  person.name !== newName ? person : returnedPerson
                )
              )
              // Check
              personService
                .get(personToFind.id)
                .then((foundPerson) => {
                  setInfoMessage({
                    message: `Updated ${newName}`,
                    type: 'info',
                  })
                  setTimeout(() => {
                    setInfoMessage(emptyMessage)
                  }, 5000)
                })
                .catch((error) => {
                  setPersons(persons.filter((p) => p.name !== newName))
                  setInfoMessage({
                    message: `Information of ${newName} has already been removed from server`,
                    type: 'error',
                  })
                  setTimeout(() => {
                    setInfoMessage(emptyMessage)
                  }, 5000)
                })
            })
            .catch((error) => {
              if (error.response.status === 400) {
                setInfoMessage({
                  message: `Invalid phone number. Please provide a valid phone number in the format XX-XXXXXXX.`,
                  type: 'error',
                })
                setTimeout(() => {
                  setInfoMessage(emptyMessage)
                }, 5000)
              } else {
                setPersons(persons.filter((p) => p.name !== newName))
                setInfoMessage({
                  message: `Information of ${newName} has already been removed from server`,
                  type: 'error',
                })
                setTimeout(() => {
                  setInfoMessage(emptyMessage)
                }, 5000)
              }
            })
        }
      } else {
        const nameObject = {
          name: newName,
          number: newNumber,
          id: persons.length + 1,
        }
        personService
          .create(nameObject)
          .then((createdPerson) => {
            setPersons(persons.concat(createdPerson))
            setNewName('')
            setNewNumber('')
            setInfoMessage({ message: `Added ${newName}`, type: 'info' })
            setTimeout(() => {
              setInfoMessage(emptyMessage)
            }, 5000)
          })
          .catch((error) => {
            // this is the way to access the error message
            console.log(error.response.data.error)
            setInfoMessage({
              message: `Name must be at least 3 characters, and Number at least 8 characters, in the format XX-XXXXXXX.`,
              type: 'error',
            })
            setTimeout(() => {
              setInfoMessage(emptyMessage)
            }, 5000)
          })
      }
    } catch (error) {
      setInfoMessage({
        message: 'Error adding person',
        type: 'error',
      })
      setTimeout(() => {
        setInfoMessage(emptyMessage)
      }, 5000)

      console.error(error)
    }
  }

  const handleDeletePerson = (id) => {
    try {
      const personName = persons.find((person) => person.id === id).name

      if (window.confirm(`Delete ${personName} ?`)) {
        // console.log(id)
        personService.remove(id).then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          setInfoMessage({
            message: `Removed ${personName}`,
            type: 'info',
          })
          setTimeout(() => {
            setInfoMessage(emptyMessage)
          }, 5000)
        })
      }
    } catch (error) {
      setInfoMessage({
        message: 'Error deleting person',
        type: 'error',
      })
      setTimeout(() => {
        setInfoMessage(emptyMessage)
      }, 5000)

      console.error(error)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const filteredPersons =
    nameFilter !== ''
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(nameFilter.toLowerCase())
        )
      : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage.message} type={infoMessage.type} />
      <Filter value={nameFilter} onChange={handleNameFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={handleAddPerson}
        valueName={newName}
        valueNumber={newNumber}
        onChangeName={handleNameChange}
        onChangeNumber={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={handleDeletePerson} />
    </div>
  )
}

export default App
