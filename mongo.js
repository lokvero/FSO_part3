import pkg from 'mongoose';
const { set, connect, Schema, model, connection } = pkg;


if (process.argv.length<3){
    console.log('add password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://lokvero_db_user:${password}@phonebook.13ewgig.mongodb.net/persons?appName=phonebook`

set('strictQuery',false)
connect(url)

const personSchema = new Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = model('Person', personSchema)

if (process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('phonebook:')
 
        result.forEach(person => {
            console.log(`${person.name}  ${person.number}`)
        })
 
        if(!result.length) console.log('Collection is empty')
        connection.close()
    })
}
else if (process.argv.length > 3){
    const person = new Person({
      id: Math.round(Math.random()*100000),
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(result => {
      if (result){
          console.log(`${person.name} with n° ${person.number} saved succesfully!`)
      }
      else console.log(`Something goes wrong!`)

      connection.close()
    })
}




