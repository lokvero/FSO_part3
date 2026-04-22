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
    validate: {
      validator: function(v) {
        return v.length >= 3;
      },
      message: props => `"${props.value}" have ${props.value.length} characters, minimum 3`
    }
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{3}-\d{5}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, `Number is empty`],
    minLength: [8, `Minimum length is 8 digits`],
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