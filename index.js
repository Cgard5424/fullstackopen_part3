require('dotenv').config()

const Person = require('./models/person')
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('type', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

let persons = [
  { 
  "id": 1,
  "name": "Arto Hellas", 
  "number": "040-123456"
  },
  { 
  "id": 2,
  "name": "Ada Lovelace", 
  "number": "39-44-5323523"
  },
  { 
  "id": 3,
  "name": "Dan Abramov", 
  "number": "12-43-234345"
  },
  { 
  "id": 4,
  "name": "Mary Poppendieck", 
  "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send(`<h1>Hello, World!</h1>`)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  const person_length = Person.countDocuments({}).then(persons => {
    res.send(`
      <p>Phonebook has info for ${persons} people</p>
      <p>${new Date}</p>
      `)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log("error message")
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateID = () => {
  return Math.floor(Math.random() * 10000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  // check if name is missing
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  // check if number is missing
  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    // id: generateID() ID is automatically generated
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })

})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})