import React from 'react'
import {connect} from 'react-redux'
import {createAnecdote} from '../reducers/anecdoteReducer'
import {notify} from './../reducers/notificationReducer'
import Filter from './Filter'

const AnecdoteForm = (props) => {
  
    const newAnecdote = async(event) => {
      event.preventDefault()
      props.createAnecdote(event.target.anecdote.value)
      props.notify(`new anecdote '${event.target.anecdote.value}' added`,10)
      event.target.anecdote.value = ''
    }
  
    return(
      <>
      <Filter/>
      <h2>create new</h2>
      <form onSubmit={newAnecdote}>
        <div><input name='anecdote'/></div>
        <button>create</button>
      </form>
      </>
    )
  }

const ConnectedAnecdoteForm = connect(
  null,
  {notify,createAnecdote}
)(AnecdoteForm)

export default ConnectedAnecdoteForm