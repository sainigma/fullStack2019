import React, {useState} from 'react'

const Books = (props) => {
  const [books,setBooks] = useState([])
  const [genres,setGenres] = useState([])
  const [genre,setGenre] = useState('')

  if (!props.show) {
    return null
  }

  const fetchGenres = (newBooks) => {
    let newGenres = []
    newBooks.map(book=>newGenres=[...newGenres, ...book.genres])
    setGenres(Array.from(new Set(newGenres)))
  }
  const fetchBooks = async(newGenre) => {
    const genreToSet = newGenre ? newGenre : ''
    const result = await props.client.query({
      query: props.booksQuery,
      variables: { genre: genreToSet },
      fetchPolicy: 'no-cache'
    })
    setBooks(result.data.allBooks)
    fetchGenres(result.data.allBooks)
  }



  if(books.length===0)fetchBooks()

  if(genre==='' && books.length !== props.result.data.allBooks.length && books.length > 0){
    fetchBooks()
  }


  const changeGenre = async(newGenre) => {
    await setGenre(newGenre)
    fetchBooks(newGenre)
  }

  return (
    <div>
      <h2>books</h2>
      {genre!=='' ? <p>in genre <strong>{genre}</strong></p> : ''}
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
      {genres.map(genre=>
        <button key={genre} onClick={()=>{changeGenre(genre)}}>{genre}</button>
      )}<button onClick={()=>{changeGenre('')}}>all</button>
    </div>
  )
}

export default Books