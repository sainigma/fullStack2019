import anecdoteService from './../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const initialState = []

export const anecdoteObject = (anecdote) => {
  return {
    content:anecdote.content,
    id:anecdote.id,
    votes:Number(anecdote.votes)
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    await anecdoteService.vote(anecdote.id,anecdote)
    dispatch({
      type: "VOTE",
      id: anecdote.id
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = {
      type: "NEW_ANECDOTE",
      content: content,
      id: getId(),
      votes:0
    }
    await anecdoteService.create(newAnecdote)
    dispatch(newAnecdote)
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const result = await anecdoteService.getAll()
    dispatch({
      type:'INIT',
      data: result.data,
    })
  }
}

const anecdoteReducer = (state = initialState, action) => {
  if (action.type === 'VOTE') {
    const anecdoteOld = state.find(n => n.id === action.id)

    const anecdoteNew = {
      ...anecdoteOld,
      votes: (anecdoteOld.votes + 1)
    }

    return state.map(anecdote =>
      anecdote.id === action.id
        ? anecdoteNew
        : anecdote
    ).sort((a, b) => { return b.votes - a.votes })
  } else if (action.type === 'NEW_ANECDOTE') {
    return state.concat(action)
  } else if (action.type === 'INIT') {
    return action.data
  }
  return state
}

export default anecdoteReducer