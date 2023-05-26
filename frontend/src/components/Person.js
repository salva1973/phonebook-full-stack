const Person = ({ person, onDelete }) => {  
  if (!person) {
    return null
  }

  return (
    <>
      {person.name} {person.number}{' '}
      <button onClick={() => onDelete(person.id)}>delete</button>
      <br />
    </>
  )
}

export default Person
