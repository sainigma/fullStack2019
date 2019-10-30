const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI

const logger = require('./utils/logger')
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then( ()=>{
    logger.info('connected to MongoDB')
}).catch((error)=>{
    logger.error('error connecting to MongoDB:',error.message)
})

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs',blogsRouter)
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)

app.use(middleware.errorHandler)
app.use(middleware.requestLogger)


module.exports = app