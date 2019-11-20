const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async(request,response) => {
    const body = request.body
    const user = await User.findOne({username:body.username}).select('+hash')
    if(user===null){
        return response.status(401).json({error:'username not found'})
    }
    const passwordCorrect = await bcrypt.compare(body.password,user.hash)
    if(!passwordCorrect){
        return response.status(401).json({
            error:'invalid password'
        })
    }
    const userForToken = {
        username: user.username,
        id: user._id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    response.status(200).send({token,username:user.username, name:user.name})
    
    response.end()
})

module.exports = loginRouter