import React from 'react'
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
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: currentNotificationState(props)
  }
  return (
    <div style={style}>
      {props.content}
    </div>
  )
}

const mapStateToProps = (state) => {
  return{
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