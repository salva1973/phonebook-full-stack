const Person = require('../models/person')

const initialPersons = [
  {
    name: 'Salva',
    number: '555-111111',
  },
  {
    name: 'John Wick',
    number: '555-222222',
  },
]

const nonExistingId = async () => {
  const person = new Person({ name: 'John Rambo', number: '555-333333' })
  await person.save()
  await person.deleteOne()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map((person) => person.toJSON())
}

module.exports = {
  initialPersons,
  nonExistingId,
  personsInDb,
}
