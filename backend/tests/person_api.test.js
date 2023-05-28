const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Person = require('../models/person')

beforeEach(async () => {
  await Person.deleteMany({})
  await Person.insertMany(helper.initialPersons)
})

// TO CONTINUE...

describe('when there are initially some persons saved', () => {
  test('persons are returned as json', async () => {
    await api
      .get('/api/persons')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all persons are returned', async () => {
    const response = await api.get('/api/persons')

    expect(response.body).toHaveLength(helper.initialPersons.length)
  })

  test('a specific person is within the returned persons', async () => {
    const response = await api.get('/api/persons')

    const names = response.body.map((r) => r.name)

    expect(names).toContain('Salva')
  })

  test('the unique identifier property of persons should be named id', async () => {
    const response = await api.get('/api/persons')
    const person = response.body[0]

    // Verify that the id property is defined
    expect(person.id).toBeDefined()

    // Verify that the _id property is not defined
    expect(person._id).toBeUndefined()
  })
})

describe('viewing a specific person', () => {
  test('succeeds with a valid id', async () => {
    const personsAtStart = await helper.personsInDb()

    const personToView = personsAtStart[0]

    const resultPerson = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultPerson.body).toEqual(personToView)
  })

  test('fails with statuscode 404 if person does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/persons/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/persons/${invalidId}`).expect(400)
  })
})

describe('addition of a new person', () => {
  test('succeeds with valid data', async () => {
    const newPerson = {
      name: 'John Rambo',
      number: '555-333333',
    }

    await api
      .post('/api/persons')
      .send(newPerson)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const personsAtEnd = await helper.personsInDb()
    expect(personsAtEnd).toHaveLength(helper.initialPersons.length + 1)

    const names = personsAtEnd.map((n) => n.name)
    expect(names).toContain('John Rambo')
  })

  test('fails with status code 400 if data invalid', async () => {
    const newPerson = {
      name: 'Commando',
    }

    await api.post('/api/persons').send(newPerson).expect(400)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd).toHaveLength(helper.initialPersons.length)
  })
})

describe('deletion of a person', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const personsAtStart = await helper.personsInDb()
    const personToDelete = personsAtStart[0]

    await api.delete(`/api/persons/${personToDelete.id}`).expect(204)

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd).toHaveLength(helper.initialPersons.length - 1)

    const names = personsAtEnd.map((r) => r.name)

    expect(names).not.toContain(personToDelete.title)
  })
})

describe('updating of a person', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const personsAtStart = await helper.personsInDb()

    const personToView = personsAtStart[0]

    let response = await api
      .get(`/api/persons/${personToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const personToUpdate = response.body

    personToUpdate.number = '555-121212'

    response = await api
      .put(`/api/persons/${personToUpdate.id}`)
      .send(personToUpdate)
      .expect(200)

    const returnedPerson = response.body

    const personsAtEnd = await helper.personsInDb()

    expect(personsAtEnd).toHaveLength(helper.initialPersons.length)
    expect(returnedPerson.number).toBe('555-121212')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
