import React from 'react'
import { Route } from 'react-router-dom'
import {connect} from 'react-redux'
import Blogs from './Blogs'
import DetailedUser from './DetailedUser'
import DetailedBlog from './DetailedBlog'
import Notification from './Notification'
import Users from './Users'
import Menu from './basic/Menu'

const MainInterface = (props) => {

  const initialized = () => {
    if(
      props.blogs[0].id!==null &&
            props.users[0].id!==null
    )return 1
    else return 0
  }

  const style={
    display: initialized() ? '' : 'none'
  }

  return(
    <div style={style}>
      <Menu initialized={initialized()}/>
      <Notification/>
      <Route exact path='/(|blogs)' component={Blogs}/>
      <Route exact path='/users' component={Users}/>
      <Route exact path='/users/:id' render={(match)=> <DetailedUser id={match.match.params.id}/>}/>
      <Route exact path='/blogs/:id' render={(match)=> <DetailedBlog id={match.match.params.id}/>}/>
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

export default connect(mapStateToProps,null)(MainInterface)