import 'dotenv/config'
import * as Sentry from '@sentry/node'
import express, { json } from 'express'
import morgan from 'morgan'
import Person from './models/person.js'
import './instrument.js'

const app = express()

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error) 
}

morgan.token('body', (req) => {
  if(req.body) return JSON.stringify(req.body)
})

app.use(json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))


app.get('/info', (request, response) => {
  response.send(
    `
      <p>Phonebook has info for ${persons.length}</p>
      <p>${new Date().toString()}</p>
    `
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result=> {
    response.json(result)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons',(request, response, next)=>{
    const body = request.body

    if((!body.name)||(!body.number)){
      return response.status(400).json({ error:'Missing name or number' })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error=>next(error))
})

Sentry.setupExpressErrorHandler(app);

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})