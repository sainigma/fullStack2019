require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())

app.use(morgan( (tokens,req,res) => {
  return [
    tokens.method(req,res),
    tokens.url(req,res),
    tokens.status(req,res),
    tokens.res(req,res,'content-length'),
    '-',
    tokens['response-time'](req,res),
    'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))


const generateId = () =>{
  let idCandidate = Math.floor( Math.random()*1E7 )
  if(!db.find(entry=>entry.id===idCandidate)){
    return idCandidate 
  }
  else{
    idCandidate = generateId()
    return idCandidate
  }
}

let db = [{}]

app.put('/api/persons/:id',(req,res,next) => {
  console.log(req.params.id)
  const body = req.body
  const updatedPerson = {
    name:body.name,
    number:body.number,
    id:req.params.id,
  }
  Person.findOneAndUpdate({id:req.params.id},updatedPerson,{new:true})
    .then( person => {
      res.json(person.toJSON())
    })
    .catch(error=>next(error))
})

app.get('/info',(req,res)=>{
  Person.find({}).then(response=>{
    db=response
    const content = [
      `Phonebook has info for ${db.length} people`,
      `${new Date()}`
    ]
    const lahetys = content.map(cursor=>`<p>${cursor}</p>`)
    res.send(lahetys.join(''))
  })
})

app.get('/api/persons',(req,res)=>{
  res.writeHead(200,{'Content-Type':'application/json'})
  Person.find({}).then(response=>{
    res.end(JSON.stringify(response))
  })
})

app.get('/api/persons/:id',(req,res,next)=>{
  Person.find({id:req.params.id}).then(person=>{
    if(person[0]){
      res.json(person)
    }else{
      res.status(404).end()
    }
  }).catch(error=>next(error))
})

app.delete('/api/persons/:id',(req,res,next)=>{
  Person.findOneAndRemove({id:req.params.id}).then(()=>{
    res.status(204).end()
  }).catch(error=>next(error))
})

app.post('/api/persons',(req,res,next)=>{
  const body = req.body
  if(!body.name||!body.number){
    return res.status(400).json({
      error:'content missing'
    })
  }else if(  db.find( entry => entry.name === body.name )  ){
    return res.status(400).json({
      error:'name must be unique'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId()
  })

  person.save().then(savedEntry => {
    db = db.concat(person)
    return res.json(savedEntry.toJSON())
  }).catch(error=>next(error))
})

const PORT = process.env.PORT
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error,req,res,next)=>{
  console.error(error.message)
  if(error.name === 'CastError' && error.kind === 'number'){
    return res.status(400).send({error:'malformatted id'})
  }
  else if(error.name === 'ValidationError'){
    return res.status(400).json({error:error.message})
  }
  next(error)
}
app.use(errorHandler)