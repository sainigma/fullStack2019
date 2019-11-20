import React from 'react'
import {connect} from 'react-redux'

const DetailedUser = (props) => {
  const user = props.users.filter(user=>user.id===props.id)[0]
  if(user===undefined)return null
  return(
    <div>
      <h2>{user.name}</h2>
            
      {user.blogs.length > 0 
        ? <div><strong>added blogs</strong><ul>{user.blogs.map( blog => 
          <li key={blog.id+'detaileduser'}>{blog.title}</li>
        )}</ul></div>
        : <p>no blogs added yet</p>
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return{
    users: state.users
  }
}

export default connect(mapStateToProps,null)(DetailedUser)