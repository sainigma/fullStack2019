import loginservice from './../services/login'
import blogsservice from './../services/blogs'

const initialState = {
  name:'',
  username: '',
  token: ''
}

const userReducer = (state = initialState, action) => {
  if (action.type === 'LOGIN'){
    const user = {
      name: action.name,
      username: action.username,
      token: action.token
    }
    window.localStorage.setItem('loggedUser',JSON.stringify(user))
    return user
  }
  if (action.type ==='LOGOUT'){
    window.localStorage.setItem('loggedUser',null)
    return initialState
  }
  return state
}

export const destroyUser = () => {
  return {
    type:'LOGOUT'
  }
}

export const login = (username,password) => {
  return async dispatch => {
    const user = await loginservice(username,password)
    dispatch({
      type: 'LOGIN',
      name: user.name,
      username: user.username,
      token: user.token
    })
  }
} 

export const storagelogin = (storage) => {
  blogsservice.setToken(storage.token)
  return {
    type: 'LOGIN',
    name: storage.name,
    username: storage.username,
    token: storage.token
  }
}

export default userReducer