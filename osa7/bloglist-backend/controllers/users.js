const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('./../models/user')
const Blog = require('./../models/blog')

const fieldValidity = (body,response) => {
    if(body.username===undefined||body.password===undefined||body.name===undefined){
        response.status(203).json("fields missing").end()
        return 0
    }else if(body.username.length<3||body.password.length<3){
        response.status(203).json("username and password must be at least 3 characters in length").end()
        return 0
    }else return 1
}

userRouter.get('/', async(request,response,next) => {
    const users = await User.find({}).populate('blogs', {url:1, title:1, author:1})
    //const result = await User.find({}).select('+hash')
    response.json(users.map(user=>user.toJSON()))
})

userRouter.post('/', async(request,response,next)=>{
    const body = request.body
    
    if(!fieldValidity(body,response))return 0

    const users = await User.findOne({username:body.username})
    if(users===null){
        const newUser = new User
        newUser.username=body.username
        newUser.name=body.name
        newUser.hash=await bcrypt.hash(body.password, 10)

        if(bcrypt.compare(body.password,newUser.hash)){
            newUser.save().then(()=>response.end()).catch(error=>next(error))
        }else response.status(203).json("unknown error").end()
    }else response.status(203).json("username taken").end()
})

module.exports = userRouter