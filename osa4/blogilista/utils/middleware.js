const logger = require('./logger')

const requestLogger = (req,res,next)=>{
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (req,res)=>{
    Response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)
    if(error.name === 'CastError' || error.name === 'ValidationError'){
        return res.status(400).json({error:error.message})
    }else if( error.name === 'JsonWebTokenError'){
        return res.status(401).json({error:'invalid token'})
    }
    next(error)
}

const tokenExtractor = (request,response,next)=>{
    const auth = request.get('authorization')
    if(auth && auth.toLowerCase().startsWith('bearer ')){
        request.token = auth.substring(7)
    }
    next()
}

module.exports = {
    errorHandler,unknownEndpoint,requestLogger,tokenExtractor
}