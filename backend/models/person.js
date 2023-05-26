const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

let database = 'database'
if (url && url.length > 13) {
  database = `${url.split('://')[0]}://<username>:<password>${
    url.split('://')[1].split('@')[1]
  }`
}

console.log(`Connecting to ${database}...`)

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: [
      {
        validator: function (value) {
          // Validate number format with two parts separated by '-'
          const parts = value.split('-')
          if (parts.length !== 2) {
            return false
          }
          // Validate first part has 2 or 3 numbers and second part consists of numbers
          return /^[0-9]{2,3}$/.test(parts[0]) && /^[0-9]+$/.test(parts[1])
        },
        message: 'Number should be in the format of XX-XXXXXXX.',
      },
    ],
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
