import React, { useState } from 'react'
import SetBirthyear from './SetBirthyear'

const Authors = (props) => {
  const [authors, setAuthors] = useState([])
  if (!props.show) {
    return null
  }
  if(props.result!==undefined&&props.result.data!==undefined&&authors!==props.result.data.allAuthors){
    setAuthors(props.result.data.allAuthors)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <SetBirthyear props={props} authors={authors}/>
      
    </div>
  )
}

export default Authors