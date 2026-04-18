import express, { json } from 'express'
import morgan from 'morgan'

const app = express()
morgan.token('body', (req) => {
  if(req.body) return JSON.stringify(req.body)
})

app.use(json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
  const id = Number(request.params.id)
  const person = persons.find(person => Number(person.id) === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
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
    const id = Math.round(Math.random()*100000)
    const person = {
        "id":id,
        "name":body.name,
        "number":body.number
    }
    persons=[...persons, person]
    // console.log(persons)

    return response.status(201).json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})