import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import {createBrowserHistory} from 'history'
import {Menu} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {destroyUser} from './../../reducers/userReducer'

const Menuobject = (props) => {
  const [activeItem,setActiveItem] = useState('')

  const changeActive = (event) => {
    const destination = event.target.attributes.href.value
    if(destination==='/'||destination.includes('blogs'))setActiveItem('blogs')
    else if(destination.includes('user'))setActiveItem('users')
  }

  useEffect( () => {
    const history = createBrowserHistory()
    const destination = history.location.pathname
    if(destination.includes('user'))setActiveItem('users')
    else if(destination.includes('blogs'))setActiveItem('blogs')
    else if(destination === '/')setActiveItem('blogs')
    else console.log('apua'+destination)
  },[])

  if (props.initialized) {

    const logout = () => {
      console.log('logout')
      props.destroyUser()
    }

    return(
      <Menu tabular>
        <Menu.Item
          as={Link} to="/"
          active={activeItem==='blogs'}
          onClick={changeActive}
        >blogs</Menu.Item>
        <Menu.Item
          as={Link} to="/users"
          active={activeItem==='users'}
          onClick={changeActive}
        >users</Menu.Item>
        <Menu.Item position='right'
          id='menulogoutbutton'
          active={false}
          onClick={logout}
        >logout</Menu.Item>
      </Menu>
    )
  } else return null 
}

const mapStateToProps = (state) => {
  return{
    user:state.user,
    users:state.users,
    blogs:state.blogs,
  }
}

export default connect(mapStateToProps,{destroyUser})(Menuobject)