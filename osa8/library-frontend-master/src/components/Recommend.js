import React, {useState} from 'react'
import { gql } from 'apollo-boost'


const Recommend = (props) => {
  const [favouriteGenre,setFavouriteGenre] = useState('')
  const [books,setBooks] = useState([])

  if(!props.show){
    if(books.length>0){
      setBooks([])
      setFavouriteGenre('')
    }
    return null
  }

  const init = async() => {
    const userquery = await props.client.query({
      query: props.meQuery,
      fetchPolicy: 'no-cache'
    })
    setFavouriteGenre(userquery.data.me.favouriteGenre)

    const booksQuery = await props.client.query({
      query: props.booksQuery,
      variables: { genre: userquery.data.me.favouriteGenre },
      fetchPolicy: 'no-cache'
    })
    setBooks(booksQuery.data.allBooks)
  }

  if(favouriteGenre===''){
    init()
  }

  return(
    <div>
      <h2>recommendations</h2>
      books in your favourite genre <strong>{favouriteGenre}</strong>:
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend