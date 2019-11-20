const listHelper = require('./../utils/list_helper')

const dummyblogs = require('./bloglist')

test('dummy returns one', () => {
  const blogs = dummyblogs
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', ()=>{
    const blogs = dummyblogs
    const expectedResult = 36

    test('total likes', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(expectedResult)
    })
})

describe('blog statistics', ()=>{
    const blogs = dummyblogs

    const expectedFavourite = dummyblogs[2]
    test('favourite blog', ()=>{
        const result = listHelper.favouriteBlog(blogs)
        expect(result).toEqual(expectedFavourite)
    })

    const expectedBlog = { author:"Edsger W. Dijkstra", likes: 12 }
    test('most likes', ()=> {
        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual(expectedBlog)
    })

    const expectedMostBlogs = { author:"Robert C. Martin", blogs:3}
    test('most blogs', ()=>{
        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual(expectedMostBlogs)
    })
})
