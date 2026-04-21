import 'dotenv/config'
import { set, connect, Schema, model } from 'mongoose'

set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new Schema({
  name: { 
    type: String,
    required: true,  
    unique: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


export default model('Person', personSchema)