import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    {anecdotes.length > 1
      ? <div>
        <h2>Anecdotes</h2>
        <ul>
          {anecdotes.map(anecdote =>
            <Link to={'/anecdotes/' + anecdote.id}><li key={anecdote.id} >{anecdote.content}</li></Link>
          )}
        </ul>
      </div>
      : anecdotes[0] !== undefined ? <div>
          <h2>{anecdotes[0].content}</h2>
          has {anecdotes[0].votes} votes <br/><br/>
          for more info see <a href={anecdotes[0].info}>{anecdotes[0].info}</a><br/><br/>
      </div>
      : <div><h2>invalid index</h2></div>
    }

  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -sovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const notificationTimeout = (notify, time) => {
  let id = window.setTimeout(() => { notify('') }, time * 1000)
  while (id--) {
    window.clearTimeout(id)
  }
}

const CreateNew = (props) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()
    await props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    props.notify(`a new anecdote ${content} created!`)
    notificationTimeout(props.notify, 10)
    props.history.push('/')

  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <button>create</button>
      </form>
    </div>
  )

}

const CreateNewWithRouter = withRouter(CreateNew)

const App = () => {

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }
  return (
    <div>
      <Router>
        <h1>Software anecdotes</h1>
        <Menu />
        {notification}
        <Route exact path="/" render={() => <AnecdoteList anecdotes={anecdotes} />} />
        <Route exact path="/anecdotes/:id" render={(match) => <AnecdoteList anecdotes={[anecdoteById(match.match.params.id)]} />} />
        <Route exact path="/create" render={() => <CreateNewWithRouter addNew={addNew} notify={setNotification} />} />
        <Route exact path="/about" render={() => <About />} />
        <Footer />
      </Router>
    </div>
  )
}

export default App;