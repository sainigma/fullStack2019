const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let sum = 0
    blogs.forEach(blog => {
        sum = sum + Number(blog.likes)
    });
    return sum
}

const favouriteBlog = (blogs) => {
    let max = 0
    let maxIndex = 0
    blogs.forEach((blog,index)=>{
        if(Number(blog.likes)>max){
            max = Number(blog.likes)
            maxIndex = index
        }
    })
    return blogs[maxIndex]
}

const mostBlogs = (blogs) => {
    let max = 0
    const authors = blogs.map( blog=> {
        return {
            author:blog.author,
            blogs:0
        }
    })
    authors.forEach(author=>{
        author.blogs=lodash.filter(authors,{author:author.author}).length
        if(author.blogs>max)max=author.blogs
    })

    return lodash.find(authors,{blogs:max})
}

const mostLikes = (blogs) => {
    const max = favouriteBlog(blogs).likes
    const mostLiked = lodash.find(blogs,{likes:max})
    return { author:mostLiked.author, likes:mostLiked.likes }
}

module.exports = {
    dummy,totalLikes,favouriteBlog,mostBlogs,mostLikes
}