import axios from 'axios'
import blogService from './blogs'
import jsonUrl from './jsonUrl'
//const baseUrl = 'http://localhost:3003/api/login'
const baseUrl = jsonUrl+'/api/login'

const login = async(username,password) => {
  const response = await axios.post(baseUrl,{
    username:username,
    password:password
  })
  if(response.status === 200){
    blogService.setToken(response.data.token)
    const user = {
      name:response.data.name,
      username:username,
      userID:response.data.id,
      token:response.data.token
    }
    return user
  }else return null
}

export default login