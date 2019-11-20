import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Label, Icon, Header, Segment, Container, Divider } from 'semantic-ui-react'
import Togglable from './basic/Togglable'
import { likeBlog } from './../reducers/blogsReducer'
import { Link } from 'react-router-dom'

const PrintBlog = (props) => {

  const blog = props.blogs.filter(b => b.id === props.id)[0]

  const [blogLikes, setBlogLikes] = useState(Number(blog.likes))

  const likeBlog = (id) => {
    props.likeBlog(id)
    setBlogLikes(blogLikes + 1)
  }

  const blogToggleRef = React.createRef()

  return (
    <Container fluid>
      <Segment clearing>
        <Header size='tiny' floated='left'>
          <Link to={'/blogs/' + blog.id}>{blog.title} </Link>
        </Header>
        <Button id={blog.title+'expand'} floated='right' onClick={() => { blogToggleRef.current.toggleVisibility() }} >
            expand
        </Button>
        <Header size='tiny' floated='right'>
          <span style={{ fontWeight: 'normal', color: 'grey' }}>by</span> {blog.author}
        </Header>

      </Segment>

      <Togglable ref={blogToggleRef}>
        <div style={{ margin: '0.8em' }}>
          <strong><a href={blog.url}>{blog.url}</a></strong>, added by <strong>{blog.user.name}</strong><br />
          <Button as='div' labelPosition='right' onClick={() => { likeBlog(blog.id) }}>
            <Button className='likebutton' icon color='red' inverted>
              <Icon name='heart' />
              Like
            </Button>
            <Label className='likevalues'  as='a' basic pointing='left'>{blog.likes}</Label>
          </Button>
        </div>
        <Divider/>
      </Togglable>
    </Container>
  )
}
const mapStateToProps = (state) => {
  return {
    blogs: state.blogs
  }
}

export default connect(mapStateToProps, { likeBlog })(PrintBlog)