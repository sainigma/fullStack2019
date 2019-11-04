import React, { useState } from 'react'
import Blogs from './../services/blogs'

const PrintBlog = (props) => {
  let blog = props.blog
  let user = props.user
  const Togglable = props.Togglable

  const [blogLikes,setBlogLikes] = useState(Number(blog.likes))
  const [blogStyle,setBlogStyle] = useState({ display:'' })

  const likeBlog = (id) => {
    Blogs.likeBlog(id) ? setBlogLikes(blogLikes+1) : console.log('error')
  }

  const RemoveBlog = (props) => {
    const deleteBlog = () => {
      window.confirm('Blog will be permanently deleted')
        ? Blogs.removeBlog(props.blog.id)
          ? setBlogStyle({ display:'none' }) : console.log('fail')
        : console.log('null')
    }
    if(user.username === props.blog.user.username){
      return(
      <><button onClick={() => {deleteBlog()}}>remove</button></>
      )
    }else return(<></>)
  }

  const blogToggleRef = React.createRef()
  return(
    <div className='blogInfo' style={blogStyle}>
      <a onClick={() => {blogToggleRef.current.toggleVisibility()}}>{blog.title} {blog.author}</a><br/>
      <Togglable ref={blogToggleRef}>
        <a href={blog.url}>{blog.url}</a><br/>
        {blogLikes} likes <button onClick={() => {likeBlog(blog.id)}}>like</button><br/>
        added by {blog.user.name}<br/>
        <RemoveBlog blog={blog}/>
      </Togglable>
    </div>
  )
}

export default PrintBlog