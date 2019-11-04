import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/login'

const login = async(username,password) => {
  const response = await axios.post(baseUrl,{
    username:username,
    password:password
  })
  if(response.status === 200){
    console.log(response.data)
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