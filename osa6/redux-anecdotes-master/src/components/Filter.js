import React from 'react'
import {connect} from 'react-redux'
import {filtering} from './../reducers/filterReducer'

const Filter = (props) => {

    const changeFilter = (event) => {
        props.filtering(event.target.value)
    }

    const style = {
        marginBottom:10
    }

    return(
        <div style={style}>
        filter <input type='text' onChange={changeFilter}/>
        </div>
    )
}

const connectedFilter = connect(
    null,
    {filtering}
  )(Filter)

export default connectedFilter