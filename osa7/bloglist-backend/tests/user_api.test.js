const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

initialUsers = [
    {
        username:"kukkonen",
        name:"Karhu Ukkonen",
        hash:"12345"
    },{
        username:"ukkonen",
        name:"Urho Kakkunen",
        hash:"12345"
    },{
        username:"kekkonen",
        name:"Urho Kekkonen",
        hash:"12345"
    }
]

beforeEach( async() => {
    await User.deleteMany({})
    
    initialUsers.forEach( async (user,index) => {
        let userObject = new User(initialUsers[index])
        await userObject.save() 
    })
})

describe('user creation tests', () => {
    
    test('username taken', async() =>{
        const invalidUser = {
            username:"ukkonen",
            name:"asd asd",
            password:"aksdjflaf",
        }
        await api.post('/api/users',invalidUser).expect(203)
    })
    test('too short password', async() =>{
        const invalidUser = {
            username:"uusityyppi",
            name:"Uusi Tyyppi",
            password:"as",
        }
        await api.post('/api/users',invalidUser).expect(203)
    })
    test('too short username', async() =>{
        const invalidUser = {
            username:"uu",
            name:"Uusi Tyyppi",
            password:"asasdfasdf",
        }
        await api.post('/api/users',invalidUser).expect(203)
    })
    test('fields missing', async() =>{
        const invalidUser = {
            username:"uuukkonen",
            name:"asd asd",
        }
        await api.post('/api/users',invalidUser).expect(203)
        await api.post('/api/users',{}).expect(203)
    })
})

afterAll( () =>{
    mongoose.connection.close()
})