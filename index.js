import express from 'express'
const app = express()

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
    const now = new Date().toString();
    const info = String(`<p>Phonebook has info for ${persons.length}</p>`
        +`<p>`+now+`</p>`)
    const html = 
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>courseinfo</title>
  </head>
  <body>
    <div id="root"></div>`
    +info+
    `</body>
</html>`
    response.send(html)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => Number(person.id) === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  response.json(person)
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})