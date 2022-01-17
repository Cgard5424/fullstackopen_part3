const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(console.log('connected to MongoDB'))
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters.'],
    maxlength: [30, 'Name must not be more than 30 characters.'],
    unique: true,
    required: true
  },
  number: {
    type: String,
    minlength: [8, 'Number must contain at least 8 numbers.'],
    maxlength: [15, 'Number must not contain more than 15 numbers'],
    required: true
  }
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)