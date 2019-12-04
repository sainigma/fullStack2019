require('dotenv').config()

const SECRET = process.env.SECRET
let MONGODB_URI = process.env.MONGODB_URI
if(process.env.NODE_ENV === 'development'){
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  MONGODB_URI,
  SECRET
}