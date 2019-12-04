import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { Query, ApolloConsumer, Mutation, useApolloClient, useSubscription } from 'react-apollo'
import { gql } from 'apollo-boost'


const BOOK_ADDED = gql `
subscription{
  bookAdded{
    title
    author{
      name
    }
    published
    genres
    id
  }
}
`

const ALL_AUTHORS = gql
`
query{
  allAuthors{
    name
    born
    bookCount
  }
}
`
const ALL_BOOKS = gql
`
query allBooks($genre: String) {
  allBooks(genre:$genre) {
    title
    author {
      name
    }
    published
    genres
    id
  }
}
`
const ADD_BOOK = gql
`
mutation createBook($title: String!, $published:Int, $author: String!, $genres: [String]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ){
    title
  }
}
`
const EDIT_AUTHOR = gql
`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo
  ){
    name
  }
}
`
const LOGIN = gql
`
mutation login($username: String!, $password: String!){
  login(username: $username, password: $password){
    value
  }
}
`
const ME = gql `
query{
  me{
    username
    favouriteGenre
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    setToken(token ? `bearer ${token}` : '',)
  },[])

  const client = useApolloClient()

  const logout = () => {
    setToken('')
    localStorage.clear()
    client.resetStore()
  }

  const toggleStyle = (testi) => {
    return {display: testi===false ? 'none' : ''}
  }

  const updateBooksCache = async(newBook) => {
    const oldBooks = await client.readQuery({query:ALL_BOOKS})
    const oldAuthors = await client.readQuery({query:ALL_AUTHORS})

    const hasId = (oldObjs,newObj) => {
      if( oldObjs.filter(obj=>obj.id===newObj.id).length===1 )return true
      else return false
    }
    const hasName = (oldObjs,newObj) => {
      if( oldObjs.filter(obj=>obj.name===newObj.name).length===1 )return true
      else return false
    }
    if( !hasId(oldBooks.allBooks, newBook) ){
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: oldBooks.allBooks.concat(newBook) }
      })

      if( !hasName(oldAuthors.allAuthors, newBook.author )){
        const newAuthor = {
          __typename: 'Author',
          name: newBook.author.name,
          born: null,
          bookCount: 1,
        }
        client.writeQuery({
          query:ALL_AUTHORS,
          data: { allAuthors: oldAuthors.allAuthors.concat(newAuthor) }
        })
      }else{
        const newAuthors = oldAuthors.allAuthors.map( author => {
          if( author.name === newBook.author.name ){
            return { ...author, bookCount: author.bookCount+1 }
          }else return author
        })
        client.writeQuery({
          query:ALL_AUTHORS,
          data: { allAuthors: newAuthors }
        })
      }
    }

  }

  useSubscription(BOOK_ADDED,{
    onSubscriptionData:({subscriptionData}) => {
      const newBook = subscriptionData.data.bookAdded
      updateBooksCache(newBook)
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button style={toggleStyle(token!=='')} onClick={() => setPage('add')}>add book</button>
        <button style={toggleStyle(token!=='')} onClick={() => setPage('recommend')}>recommend</button>
        <button style={toggleStyle(token==='')} onClick={() => setPage('login')}>login</button>
        <button style={toggleStyle(token!=='')} onClick={logout}>logout</button>
      </div>
      <Mutation mutation={EDIT_AUTHOR} refetchQueries={[{query:ALL_AUTHORS}]}>
        {(changeBirthyear)=>
          <ApolloConsumer>
          {(
            client =>
              <Query query={ALL_AUTHORS}>
                {(result) =>
                  <Authors token={token} changeBirthyear={changeBirthyear} result={result} client={client} show={page==='authors'}/>
                }
              </Query>
          )}
        </ApolloConsumer>
        }
      </Mutation>
      <ApolloConsumer>
      {(
          client =>
            <Query query={ALL_BOOKS}>
              {(result)=>
                <Books result={result} booksQuery={ALL_BOOKS} client={client} show={page==='books'}/>
              }
            </Query>
      )}
      </ApolloConsumer>
      <Mutation
        mutation={ADD_BOOK}
        refetchQueries={[{query:ALL_AUTHORS},{query:ALL_BOOKS}]}
        onError={(error)=>console.log(error)}
      >
        {(addBook) => 
          <NewBook addBook={addBook} setPage={setPage} show={page==='add'}/>
        }
      </Mutation>
      <Mutation
        mutation={LOGIN}
        onError={(error)=>console.log(error)}
      >
        {(loginMutator) => 
          <Login loginMutator={loginMutator} setToken={setToken} setPage={setPage} show={page==='login'}/>
        }
      </Mutation>
      <Recommend client={client} meQuery={ME} booksQuery={ALL_BOOKS} show={page==='recommend'}/>
    </div>
  )
}

export default App