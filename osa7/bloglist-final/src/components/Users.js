import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import { initUsers } from './../reducers/usersReducer'

const User = (props) => {
  const user = props.user
  const userUrl = `/users/${user.id}`
  return(
    <><tr>
      <td>
        <Link to={userUrl}>{user.name}</Link>
      </td>
      <td>{user.blogs.length}</td>
    </tr></>
  )
}

const Users = (props) => {

  useEffect( () => {
    props.initUsers()
  },[])

  return(
    <>
      <h2>Users</h2>
      <table><tbody>
        <tr><th></th><th>blogs created</th></tr>
        {props.users.map(user=><User key={user.id} user={user}/>)}
      </tbody></table>
    </>
  )
}

const mapStateToProps = (state) => {
  return{
    users:state.users
  }
}

export default connect(mapStateToProps,{initUsers})(Users) 