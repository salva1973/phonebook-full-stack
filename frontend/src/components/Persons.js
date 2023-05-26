import Person from './Person'

const Persons = ({ persons, onDelete }) => (
  <>
    {persons.map((person) => {
      if (!person) {
        return null
      }
      return <Person key={person.id} person={person} onDelete={onDelete} />
    })}
  </>
)

export default Persons
