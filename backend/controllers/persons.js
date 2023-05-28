const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

personsRouter.post('/', async (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({
      error: 'Provide name and number',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  const savedPerson = await person.save()
  response.status(201).json(savedPerson)
})

personsRouter.get('/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)
  if (person) {
    response.json(person)
  } else {
    response.statusMessage = 'Page Not Found. The force is weak with this one!'
    response.status(404).end()
  }
})

personsRouter.delete('/:id', async (request, response) => {
  await Person.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

personsRouter.put('/:id', async (request, response) => {
  const { name, number } = request.body

  const updatedPerson = await Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
  response.json(updatedPerson)
})

module.exports = personsRouter
