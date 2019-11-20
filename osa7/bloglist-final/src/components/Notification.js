import React from 'react'
import {Message} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {notify, notificationSent} from './../reducers/notificationReducer'

const currentNotificationState = (props) => {
  const visibility = props.content === '' ? 'none' : ''
  if(visibility===''&&!props.sent){
    window.clearTimeout(props.timeout)
    let newTimeout = window.setTimeout(()=>{props.notify('')},1000*props.time)
    props.notificationSent(newTimeout)
  }
  return visibility
}

const Notification = (props) => {
  const hasErrors = props.content.includes('$Error')
  const message = props.content.replace('$user',props.user.name).replace('$','')
  const dismiss = () => {
    props.notify('')
  }
  const color = hasErrors === true ? 'red' : 'green'
  if(currentNotificationState(props)===''){return (
    <Message onDismiss={dismiss} content={message} color={color}/>
  )}else return null
}

const mapStateToProps = (state) => {
  return{
    user: state.user,
    content: state.notification.content,
    timeout: state.notification.timeout,
    time: state.notification.time,
    sent: state.notification.sent,
  }
}

const ConnectedNotification = connect(
  mapStateToProps,
  {notify, notificationSent}
)(Notification)

export default ConnectedNotification