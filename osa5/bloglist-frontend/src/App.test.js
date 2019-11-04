import React from 'react'
import { render, waitForElement, prettyDOM } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
jest.mock('./services/blogs')
import App from './App'

describe('<App />', () => {

  test('if no user logged, notes are not rendered', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)
    console.log(prettyDOM(component.container))
    expect(component.container).toHaveTextContent('log in to application')
    expect(component.container).not.toHaveTextContent('http://www.google.com')
  })

  test('login test', async () => {
    const component = render(
      <App />
    )
    component.rerender(<App />)
    expect(component.container).toHaveTextContent('log in to application')

    const user = {
      username:'KaKari',
      token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkthS2FyaSIsImlkIjoiNWRiOTg2NTRjNjY3MGEzNzJjMTRlZTliIiwiaWF0IjoxNTcyODcxODYzfQ.Um7txP7jfgLh7mq2fTNXFcliLyxjyZukuHCMWKYRF4Q',
      name:'Kari Suominen'
    }
    await localStorage.setItem('loggedUser', JSON.stringify(user))
    await component.rerender(<App />)
    console.log(prettyDOM(component.container))
    expect(component.container).not.toHaveTextContent('log in to application')
    expect(component.container).toHaveTextContent('http://www.google.com')
  })
})