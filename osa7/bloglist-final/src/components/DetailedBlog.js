import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Icon, Label, Breadcrumb, Modal, Header } from 'semantic-ui-react'
import { likeBlog, sendComment, deleteBlog } from './../reducers/blogsReducer'

const DetailedBlog = (props) => {

  const Likes = () => {
    return(
      <Button as='div' labelPosition='right' onClick={() => { props.likeBlog(blog.id) }}>
        <Button icon color='red' inverted>
          <Icon name='heart'/>
              Like
        </Button>
        <Label as='a' basic pointing='left'>{blog.likes}</Label>
      </Button>
    )
  }

  const DeleteBlog = () => {
    if( blog.user.username === props.user.username ){
      return(
        <>
          <Modal closeIcon trigger={<Button color='black'><Icon name='archive'/>Delete</Button>} basic size='small'>
            <Header icon='archive' content='Delete blog'/>
            <Modal.Content>
              <p>{'This will permanently delete this entry and it\'s contents. Proceed?'}</p>
              <Button
                className='finalDelete'
                as={Link} to="/"
                onClick={()=>{
                  props.deleteBlog(blog.id)
                }}
                color='red' inverted
              >
                <Icon name='checkmark'/> Delete
              </Button>
            </Modal.Content>
          </Modal>
        </>
      )} else return null
  }

  const newComment = (event) => {
    event.preventDefault()
    props.sendComment(props.id,event.target.comment.value)
  }

  const blog = props.blogs.filter(b => b.id === props.id)[0]
  if (blog === undefined) return null

  const hasComments = () => {
    if (blog.comments !== undefined && blog.comments.length > 0){
      return 1
    } else return 0
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Section as={Link} to='/'>home</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section as={Link} to='/blogs'>blogs</Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>{blog.id}</Breadcrumb.Section>
      </Breadcrumb>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a><br />
            
            added by {blog.user.name}<br />
      <Likes />
      <DeleteBlog />
      <h3>comments</h3>
      <form onSubmit={newComment}><input name="comment"></input><button type='submit'>add comment</button></form>
      {hasComments() === 1
        ? <ul>{blog.comments.map((comment,index) => <li key={'kommentti'+index+blog.id}>{comment}</li>)}</ul>
        : <p>no comments yet</p>}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs,
    user: state.user
  }
}

export default connect(mapStateToProps, 
  { 
    likeBlog,
    sendComment,
    deleteBlog
  })(DetailedBlog)