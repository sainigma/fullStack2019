import React, { useState,useEffect,useImperativeHandle } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import PrintBlog from './Blog'
import { prettyDOM } from '@testing-library/dom'



describe('Blog tests', () => {

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
      <div>
        <div className="togglableNappi" style={hideWhenVisible}><DrawButton/></div>
        <div className="togglableSisalto" style={showWhenVisible}>
          {props.children}
        </div>
      </div>
    )
  })

  const user = {
    username:'testiukkeli',
    name:'Testi Ukkeli',
    id:'12345'
  }

  const testiBlogit = [{
    title:'otsikko',
    author:'tekija',
    likes:666,
    url:'http://www.google.com',
    user:{
      username:user.username,
      name:user.name,
      id:user.id
    }
  },{
    title:'otsikko joltain toiselta',
    author:'toinen tekija',
    likes:666,
    url:'http://www.google.com',
    user:{
      username:'jokutoinen',
      name:'Joku Toinen',
      id:'54321'
    }
  }]

  test('Single blog visibility tests', () => {
    const testiBlogi = testiBlogit[1]
    let component = render(
      <PrintBlog blog={testiBlogi} user={user} Togglable={Togglable}/>
    )
    let bloginAvaus = component.container.querySelector('a')
    let sisaltoDiv = component.container.querySelector('.togglableSisalto')
    expect(bloginAvaus).toHaveTextContent(testiBlogi.title)
    expect(bloginAvaus).toHaveTextContent(testiBlogi.author)
    expect(sisaltoDiv).toHaveStyle('display:none')
    console.log(prettyDOM(component.container))
    fireEvent.click(bloginAvaus)
    console.log(prettyDOM(component.container))
    expect(sisaltoDiv).toHaveStyle('display:block')

  })

})