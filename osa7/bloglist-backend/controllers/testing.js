const testRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('./../models/user')

testRouter.post('/reset', async(request,response)=>{
  console.log('Tietokanta tyhjennetty')
  await Blog.deleteMany({})
  await User.deleteMany({})
  response.status(200).json({
    status:'Tietokanta tyhjennetty'
  })
})

module.exports = testRouter