import usersService from './../services/users'

const initialState = [
  {
    blogs:[
      [{
        title:null,
        author:null,
        url:null,
        id:null
      }]
    ],
    username:null,
    name:null,
    id:null
  }
]

const usersReducer = (state=initialState, action) => {
  if (action.type === 'INITUSERS'){
    return action.data
  }
  return state
}

export const initUsers = () => {
  return async dispatch => {
    const users = await usersService.getUsers()
    dispatch({
      type:'INITUSERS',
      data: users
    })
  }
}

export default usersReducer