import React from 'react'
import  { useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import Login from './components/Login'
import MainInterface from './components/MainInterface'

import {notify} from './reducers/notificationReducer'
import {initBlogs} from './reducers/blogsReducer'
import {initUsers} from './reducers/usersReducer'
import {storagelogin} from './reducers/userReducer'
import 'fomantic-ui-css/semantic.min.css'
import './App.css'

let storageState = 0

const App = (props) => {

  const style={
    display: storageState === 1 ? '' : 'none' 
  }

  useEffect( () => {
    props.initBlogs()
    props.initUsers()
    const loggedUserJSON = JSON.parse(window.localStorage.getItem('loggedUser'))
    if(loggedUserJSON!==null){
      props.storagelogin(loggedUserJSON)
      storageState = 1
    }else storageState = 1
  },[])
    
  return(
    <div>
      <Container>
        <Router>
          {props.user.token===''
            ? <div style={style}><Login /></div>
            : <MainInterface/>
          }
        </Router>
      </Container>
    </div>
  )
}

const mapStateToProps = (state) => {
  return{
    user:state.user,
    users:state.users,
    blogs:state.blogs,
  }
}

export default connect(mapStateToProps,{notify,initBlogs,initUsers,storagelogin})(App)