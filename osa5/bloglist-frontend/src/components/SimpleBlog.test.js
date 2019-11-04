import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'
import { prettyDOM } from '@testing-library/dom'
import { exportAllDeclaration } from '@babel/types'

afterEach(cleanup)

describe('General tests', () => {

  const testiBlog = {
    title:'otsikko',
    author:'tekija',
    likes:5,
  }
  const onClickTest = () => {
    return 1
  }


  test('number of likes', () => {
    const component = render(
      <SimpleBlog blog={testiBlog}/>
    )
    expect(component.container).toHaveTextContent(
      'blog has '+testiBlog.likes+' likes'
    )
  })

  test('onclick test', () => {
    const component = render(
      <SimpleBlog blog={testiBlog}/>
    )
    const simplebutton = component.container.querySelector('button')
    expect(fireEvent.click(simplebutton)+fireEvent.click(simplebutton) === 2)
  })

})
