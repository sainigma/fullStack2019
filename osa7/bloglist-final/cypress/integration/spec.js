/* eslint-disable no-undef */

const user = {
  name: 'Testi Käyttäjä',
  username: 'KaKari',
  password: 'salasana'
}

let token = ''

describe('API reset', function(){
  it('users and blogs dropped', function(){
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
  })
  it('testuser created', function(){
    cy.request('POST', 'http://localhost:3003/api/users/', user)
  })
  it('user exists', function(){
    cy.request('POST', 'http://localhost:3003/api/login/', {...user}).then((response)=>{
      token = response.body.token
      cy.wait(5)
    })
  })
  it('functional token', function(){
    cy.expect(token!=='')
  })
  it('create dummy blog', function(){
    cy.request({
      method: 'POST',
      url: 'http://localhost:3003/api/blogs/',
      headers: {
        'Authorization':'bearer '+token
      },
      body: {
        title:'ekablog',
        author:'ekanblogin author',
        url:'www.yle.fi'
      }
    })

  })
})

describe('General tests', function(){
  beforeEach(function() {
    cy.visit('http://localhost:3000')
  })
  it('front page can be opened', function(){
    cy.contains('log in to application')
  })    
  it('login form is functional', function(){
    cy.contains('login').click()
  })
  it('login test', function(){
    cy.get('#username').type(user.username)
    cy.get('#password').type(user.password)
    cy.contains('login').click()
    cy.contains('Welcome back Testi Käyttäjä')
  })
})


describe('Test that require login', function(){
  
  beforeEach(function(){
    cy.reload()
    cy.get('#username').type('KaKari')
    cy.get('#password').type('salasana')
    cy.contains('login').click()
  })
  it('blog creation test', function(){
    cy.contains('create new').click()
    cy.get('#newblogtitle').type('Cypresstesti')
    cy.get('#newblogauthor').type('Cypress - Testi Käyttäjä')
    cy.get('#newblogurl').type('https://yle.fi')
    cy.contains('submit').click()
    cy.contains('Cypresstesti')
    cy.contains('Cypress - Testi Käyttäjä')
  })
  it('blog like test', function(){
    cy.get('#Cypresstestiexpand').click()
    cy.get('.likevalues:visible').contains('1')
    cy.get('.likebutton:visible').click()
    cy.get('.likevalues:visible').contains('2')
  })
  it('blog deletion test', function(){
    cy.contains('Cypresstesti').click()
    cy.contains('Delete').click()
    cy.get('.finalDelete:visible').click()
    cy.contains('Cypresstesti').not()
  })
  it('logout test', function(){
    cy.contains('logout').click()
    cy.contains('log in to application')
  })
})