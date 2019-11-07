import React from 'react'
import {connect} from 'react-redux'
import {voteAnecdote} from './../reducers/anecdoteReducer'
import {notify} from './../reducers/notificationReducer'

const filterAnecdotes = ({anecdotes,filter}) =>{
  
  if( filter.content!=='' ){
    return anecdotes.filter(anecdote=>anecdote.content.toUpperCase().includes(filter.content.toUpperCase()))
  }
  return anecdotes
}

const AnecdoteList = (props) => {

  const vote = async (anecdote) => {
    props.voteAnecdote(anecdote)
    props.notify(`you voted '${anecdote.content}'`,10)
  }

  return(
    <>
      {props.anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

const mapStateToProps = (state) => {
  return{
    anecdotes: filterAnecdotes(state)
  }
}

const mapDispatchToProps = {
  notify,
  voteAnecdote,
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList