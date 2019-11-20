import React from 'react'
import {connect} from 'react-redux'
import {Form,Button} from 'semantic-ui-react'
import {login} from './../reducers/userReducer'
import {notify} from './../reducers/notificationReducer'
import {initUsers} from './../reducers/usersReducer'

const Login = (props) => {

  const sendCredentials = async(event) => {
    event.preventDefault()
        
    await props.login(
      event.target.username.value,
      event.target.password.value)
    props.notify('Welcome back $user',5)
  }

  return(
    <div>
      <h1>log in to application</h1>
      <Form onSubmit={sendCredentials}>
        <Form.Field>
          <label>username</label>
          <input id='username' name='username'/>
        </Form.Field>
        <Form.Field>
          <label>password</label>
          <input id='password' name='password' type='password'/>
        </Form.Field>
        <Button type="submit">login</Button>
      </Form>
    </div>
  )
}

const mapStateToProps = (state) => {
  return{
    user: state.user
  }
}

const ConnectedLogin = connect(
  mapStateToProps,
  {login,notify,initUsers}
)(Login)

export default ConnectedLogin