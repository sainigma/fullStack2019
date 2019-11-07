import axios from 'axios'
import {anecdoteObject} from './../reducers/anecdoteReducer'

const baseURI = 'http://localhost:3003/anecdotes'

const getAll = () => {
    return axios.get(baseURI)
}

const create = result => {
    const newAnecdote = anecdoteObject(result)
    return axios.post(baseURI,newAnecdote)
}

const vote = (id, result) => {
    const updatedAnecdote = {
        ...anecdoteObject(result),
        votes:result.votes+1
    }
    return axios.put(baseURI+'/'+id,updatedAnecdote)
}

export default {
    getAll: getAll,
    create: create,
    vote: vote,
}