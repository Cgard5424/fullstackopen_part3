const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.pwl5m.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const input_name = process.argv[3]
  const input_number = process.argv[4]

  const person = new Person({
    id: input_name,
    name: input_name,
    number: input_number
  })

  person.save().then(result => {
    console.log(`added ${input_name} number ${input_number} to phonebook`)
    mongoose.connection.close()
  })
}