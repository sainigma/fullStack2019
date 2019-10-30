const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs.map(blog=>blog.toJSON()))
  })

blogsRouter.post('/', async(request, response, next) => {
  const body = new Blog(request.body)

  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id){
      return response.status(401).json({error:'token missing or invalid'})
    }
    
    const user = await User.findById(decodedToken.id)
    
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id,
      likes: 1,
    })
    try {
      const result = await blog.save()
      user.blogs = user.blogs.concat(result._id)
      await user.save()
      response.json(result.toJSON())
    }catch(exception){
      next(exception)
    }

  }catch(exception){next(exception)}

})

blogsRouter.delete('/', (request,response) => {
  response.status(404).end()
})

blogsRouter.delete('/:id', async (request,response,next)=>{
  try{
    const decodedToken = jwt.verify(request.token,process.env.SECRET)
    if(!request.token || !decodedToken.id){
      return response.status(401).json({error:'token missing or invalid'})
    }
    const waitingDeletion = await Blog.findOne({_id:request.params.id})
    if(waitingDeletion===null){
      return response.status(401).json({error:'invalid blog id'})
    }
    if(waitingDeletion.user.toString()===decodedToken.id){
      const result = await Blog.deleteOne({_id:request.params.id}).catch(error=>next(error)).catch(error=>next(error))
      if(result.deletedCount===1)response.end()
      else response.status(204).end()
    }else{
      return response.status(401).json({error:'invalid user rights'})
    }
  }catch(exception){next(exception)}
})

blogsRouter.post('/:id', async (request,response,next)=>{
  const likes = await Blog.findOne({_id:request.params.id}).catch(error=>next(error))
  if(likes!==undefined){
    const result = await Blog.updateOne({_id:request.params.id},{likes:Number(likes.likes)+1}).catch(error=>next(error))
    response.end()
  }
})
module.exports = blogsRouter