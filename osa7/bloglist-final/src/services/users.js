import axios from 'axios'
//const baseUrl = 'http://localhost:3003/api/users'
import jsonUrl from './jsonUrl'
const baseUrl = jsonUrl+'/api/users'

const getUsers = async() => {
  const request = await axios.get(baseUrl)
  return request.data
}

export default {getUsers,}