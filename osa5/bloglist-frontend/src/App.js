import React, { useState,useEffect,useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import loginService from './services/login'
import Blogs from './services/blogs'
import PrintBlog from './components/Blog'
import  { useField } from './hooks'
import './App.css'


const Togglable = React.forwardRef((props, ref) => {
  const toggleLabel = props.toggleLabel

  const [visible,setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    console.log('visibility toggled')
    setVisible(!visible)
  }

  useImperativeHandle(ref,() => {
    return{
      toggleVisibility
    }
  })

  const DrawButton = () => {
    if(toggleLabel!==undefined){
      return(
        <><button onClick={toggleVisibility}>{toggleLabel}</button></>
      )
    }else return(<></>)
  }

  return(
    <div>
      <div style={hideWhenVisible}><DrawButton/></div>
      <div style={showWhenVisible}>
        {props.children}
      </div>
    </div>
  )
})

const PrimaryInterface = (props) => {
  const user = props.user
  let blogs = props.blogs
  let setBlogs = props.setBlogs
  let setStatusMessage = props.setStatusMessage

  const Logout = () => {
    props.setUser(null)
    props.username.reset()
    window.localStorage.setItem('loggedUser',null)
  }

  const CreateBlog = () => {
    const [newBlogTitle,setNewBlogTitle] = useState('')
    const [newBlogAuthor,setNewBlogAuthor] = useState('')
    const [newBlogUrl,setNewBlogUrl] = useState('')

    const changeNewBlog = (event) => {
      const value = event.target.value
      switch(event.target.name){
      case 'title': setNewBlogTitle(value); break
      case 'author': setNewBlogAuthor(value); break
      case 'url': setNewBlogUrl(value); break
      default: break
      }
    }

    const checkFields = () => {
      if(newBlogTitle.length>2&&newBlogUrl.length>2)return 1
      else{
        setStatusMessage({ message:'fields missing or invalid credentials',ok:false })
      }
    }

    const submitBlog = (event) => {
      event.preventDefault()
      if(checkFields()){
        Blogs.submitBlog(newBlogTitle,newBlogAuthor,newBlogUrl).then( result => {
          if(result){
            setBlogs([])
            setStatusMessage({ message:`a new blog ${newBlogTitle} by ${newBlogAuthor} added`,ok:true })
          }
        }).catch(() => {
          setStatusMessage({ message:'fields missing or invalid credentials',ok:false })
        })
      }
    }

    const toggleRef = React.createRef()
    return(
      <>
        <Togglable toggleLabel='new blog' ref={toggleRef}>
          <h2>create new</h2>
          <form onSubmit={submitBlog}>
            <table><tbody>
              <tr><td>title:</td><td><input name='title' value={newBlogTitle} onChange={changeNewBlog} /></td></tr>
              <tr><td>author:</td><td><input name='author' value={newBlogAuthor} onChange={changeNewBlog} /></td></tr>
              <tr><td>url:</td><td><input name='url' value={newBlogUrl} onChange={changeNewBlog} /></td></tr>
              <tr><td></td><td><button type='submit'>create</button><button type='button' onClick={() => {toggleRef.current.toggleVisibility()}}>close</button></td></tr>
            </tbody></table>
          </form>
        </Togglable>
      </>
    )
  }

  const Fetchblogs = () => {
    if(blogs.length===0)
      Blogs
        .getAll()
        .then(
          result => setBlogs(
            result.sort(
              (a,b) => {return b.likes - a.likes}
            )
          )
        )
    return(
      <>{blogs.map(blog => <PrintBlog key={blog.id} blog={blog} user={user} Togglable={Togglable}/>)}</>
    )
  }

  if(!props.user)return(<></>)
  else return(
    <div>
      <h1>blogs</h1>
      <p>{props.user.name} logged in<button onClick={() => { Logout()  }}>logout</button></p>
      <CreateBlog newBlog={props.newBlog} setNewBlog={props.setNewBlog}/>
      <Fetchblogs username={props.user.username} all={true}/>
    </div>
  )
}


const Login = (props) => {
  const setStatusMessage = props.setStatusMessage

  const sendCredentials = (event) => {
    event.preventDefault()
    loginService(props.username.value,props.password.value).then(result => {
      props.username.update(result)
      Blogs.setToken(result.token)
      window.localStorage.setItem( 'loggedUser', JSON.stringify(result) )
      setStatusMessage({ message:'login successful',ok:true })
    }).catch(() => (setStatusMessage({ message:'wrong username or password',ok:false })))
  }

  return(
    <div>
      <form onSubmit={sendCredentials}>
        <h1>log in to application</h1>
        username <input {...props.username.jsx}/><br/>
        password <input {...props.password.jsx}/><br/>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

Login.propTypes = {
  username: PropTypes.object.isRequired,
  password: PropTypes.object.isRequired,
  setStatusMessage: PropTypes.func.isRequired,
}

const Status = (props) => {
  let style={ display:'none' }
  let message='null'
  if(props.statusMessage){
    let borderColor = props.statusMessage.ok ? 'green' : 'red'
    style={ display:'', border: '0.4em solid '+borderColor }
    setTimeout( () => props.setStatusMessage(null),3000 )
    message=props.statusMessage.message
  }
  return(
    <div className='statusOK' style={style}>
      <h3 className="statusmessage">{message}</h3>
    </div>
  )
}

const App = () => {
  const username = useField('text')
  const password = useField('password')
  const [blogs, setBlogs] = useState([])
  const [user,setUser] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect( () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(!user && loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      if(user)Blogs.setToken(user.token)
    }
  })


  if(!user){
    return(
      <div>
        <Login
          user={user}
          username={username}
          password={password}
          setUser={setUser}
          statusMessage={statusMessage}
          setStatusMessage={setStatusMessage}
        />
        <Status statusMessage={statusMessage} setStatusMessage={setStatusMessage}/>
      </div>
    )
  }
  else return(
    <div>
      <PrimaryInterface
        user={user}
        username={username}
        setUser={setUser}
        blogs={blogs}
        statusMessage={statusMessage}
        setBlogs={setBlogs}
        setStatusMessage={setStatusMessage}
      />
      <Status statusMessage={statusMessage} setStatusMessage={setStatusMessage}/>
    </div>
  )
}

export default App
