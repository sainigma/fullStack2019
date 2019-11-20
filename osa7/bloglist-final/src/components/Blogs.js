import React,{useState} from 'react'
import {Form,Button, Segment, Grid} from 'semantic-ui-react'
import {connect} from 'react-redux'
import PrintBlog from './PrintBlog'
import Togglable from './basic/Togglable'
import {notify} from './../reducers/notificationReducer'
import {sendBlog} from './../reducers/blogsReducer'
const Blogs = (props) => {

  const checkValidity = (title,author,url) => {
    return {
      passes: !(title===''||author===''||url===''),
      errors: [title==='',author==='',url==='']}
  }

  const CreateNew = () => {
    const [visibility,setVisibility] = useState('')
    let buttonstyle = {
      display:visibility
    }
    const createToggleRef = React.createRef()

    const toggleDialog = () => {
      visibility==='' ? setVisibility('none') : setVisibility('')
      createToggleRef.current.toggleVisibility()
    }

    const submitNewBlog = (event) => {
      event.preventDefault()
      const title = event.target.title.value
      const author = event.target.author.value
      const url = event.target.url.value
      const valid = checkValidity(title,author,url)
      if(valid.passes){
        props.sendBlog(title,author,url)
        props.notify('New blog `'+title+'` has been added!')
        toggleDialog()
        event.target.title.value=''
        event.target.author.value=''
        event.target.url.value=''
      }else{
        let message = '$Error, fields missing: '
        if(valid.errors[0])message+='Title '
        if(valid.errors[1])message+='Author '
        if(valid.errors[2])message+='Url'
        props.notify(message)
      }
    }

    const fields = [
      'title','author','url'
    ]

    return(
      <Segment piled>
        <Button id='newblogbutton' floated='left' style={buttonstyle} onClick={toggleDialog}>create new</Button>
        <Togglable ref={createToggleRef}>
          <Form onSubmit={submitNewBlog}>
            {fields.map(field=>
              <Form.Field key={'createfields'+field}>
                <label>{field}</label>
                <input id={'newblog'+field} name={field}/>
              </Form.Field>
            )}
            <Button type='submit'>submit</Button>
            <Button type='button' onClick={toggleDialog}>cancel</Button>
          </Form>
        </Togglable><br/><br/>
      </Segment>
    )
  }
    
    

  if(props.blogs[0].id===null)return null
  return(
    <div>
      <h2>Blogs</h2>
      <Grid columns={2}>
        <Grid.Column width={10}>
          {props.blogs.map(blog=><PrintBlog key={blog.id} id={blog.id}/>)}
        </Grid.Column>
        <Grid.Column width={6}>
          <CreateNew/>
        </Grid.Column>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return{
    blogs:state.blogs,
    user:state.user
  }
}
//
export default connect(mapStateToProps,{notify,sendBlog})(Blogs)