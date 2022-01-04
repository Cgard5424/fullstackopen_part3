const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const morgan = require('morgan')
//const { response } = require('express')
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:', request.path)
//   console.log('Body:', request.body)
//   console.log('---')
//   next()
// }

// app.use(requestLogger)

morgan.token('type', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

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
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(400).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
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

  // check if the person is already in the database
  Person.find({ name: body.name})
    .then(person => {
      if (person.length !== 0) {
        return res.status(400).json({
          error: 'name already exists in databse'
        })
      }
    })
    .catch(error => next(error))

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})