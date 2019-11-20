import React, { useState,useImperativeHandle } from 'react'

const Togglable = React.forwardRef((props, ref) => {
  const toggleLabel = props.toggleLabel
  
  const [visible,setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  
  const toggleVisibility = () => {
    console.log('visibility toggled')
    setVisible(!visible)
  }
  
  useImperativeHandle(ref,() => {
    return{
      toggleVisibility
    }
  })
  
  const DrawButton = () => {
    if(toggleLabel!==undefined){
      return(
        <><button onClick={toggleVisibility}>{toggleLabel}</button></>
      )
    }else return(<></>)
  }
  
  return(
    <>
      <div style={hideWhenVisible}><DrawButton/></div>
      <div style={showWhenVisible}>
        {props.children}
      </div>
    </>
  )
})

export default Togglable