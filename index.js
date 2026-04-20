import 'dotenv/config'
import express, { json } from 'express'
import morgan from 'morgan'
import Person from './models/person.js'
// import cors from 'cors'

const app = express()

morgan.token('body', (req) => {
  if(req.body) return JSON.stringify(req.body)
})

// app.use(cors())
app.use(json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

let persons = []

app.get('/info', (request, response) => {
    response.send(
      `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>courseinfo</title>
        </head>
        <body>
          <p>Phonebook has info for ${persons.length}</p>
          <p>${new Date().toString()}</p>
        </body>
      </html>
      `
    )
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result=> {
    response.json(result)
  })
})

app.get('/favicon.svg', (req, res) => res.status(204).end()); // Error GET favicon.svg not found

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons',(request, response)=>{
    const body = request.body
    if ( (!body.name)||(!body.number) ){
        return response.status(400).json({error:"Missing name or number"})
    }
    else if (persons.filter( person => person.name === body.name ).length){
        return response.status(500).json({error:"Name must be unique"})
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})