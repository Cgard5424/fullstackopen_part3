const { response } = require('express')
const express = require('express')
const app = express()

app.use(express.json())

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

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const num_persons = persons.length
  const date = Date()
  response.send(`Phonebook has info for ${num_persons} people<br>${date}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }

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
  //console.log('Object.values(persons).includes(body.name) is ' + Object.values(persons).includes(body.name))

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

  // check if name is already in phonebook
  const check_duplicate = persons.filter(person => person.name === body.name)
  if (check_duplicate.length !== 0) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateID()
  }

  persons = persons.concat(person)

  res.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})