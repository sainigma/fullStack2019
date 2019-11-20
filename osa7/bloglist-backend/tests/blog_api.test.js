const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "React tests",
        author: "Michael test",
        url: "https://reactpatterns.test/",
        likes: 766,
      },
      {
        title: "Go To tests Considered Harmful",
        author: "Edsger test. Dijkstra",
        url: "http://www.u.test.test/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 555,
      },
]

beforeEach( async () => {
    await Blog.deleteMany({})
    
    initialBlogs.forEach( async (blog,index) => {
        let blogObject = new Blog(initialBlogs[index])
        await blogObject.save() 
    })
})

test('return value is json', async () =>{
    await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
})

describe('async tests', () => {
    test('number of blogs', async() =>{
        const expectedBlogs = initialBlogs.length
        const resultBlogs = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type',/application\/json/)
        expect(resultBlogs.body.length).toEqual(expectedBlogs)
    })

    test('id is defined for all', async() =>{
        const resultBlogs = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type',/application\/json/)
        resultBlogs.body.forEach(blog=>expect(blog.id).toBeDefined())
    })

    test('post works', async() =>{
        const expectedBlogs = initialBlogs.length + 1
        const dummyBlog = {
            title: "catcher in the test",
            author: "place holden",
            url: "https://test.test",
            likes: 1,
        }
        await new Blog(dummyBlog).save()
        const resultBlogs = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type',/application\/json/)
        expect(resultBlogs.body.length).toBe(expectedBlogs)
    })

    test('blank likes-field', async()=>{
        const dummyBlog = {
            title: "does not like",
            author: "empty like field",
            url: "https://like.like",
        }
        await new Blog(dummyBlog).save()
        const resultBlogs = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type',/application\/json/)
        expect(resultBlogs.body[initialBlogs.length].likes).toBeDefined()
    })

    test('blank title and url reject test, passes if triggers validationerror', async()=>{
        const dummyBlog = {
            likes: 666
        }
        let result = await new Blog(dummyBlog).save().catch( (result) => {
            expect(result.name).toBe("ValidationError")
        })
    })
})


afterAll( () =>{
    mongoose.connection.close()
})