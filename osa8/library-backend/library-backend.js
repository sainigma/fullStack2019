const config = require('./utils/config')
const mongoose = require('mongoose')
const { ApolloServer, UserInputError, gql, PubSub } = require('apollo-server')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const jwt = require('jsonwebtoken')

const JWT_SECRET = config.SECRET
const mongoURI = config.MONGODB_URI

const tempPassword = "salasana"

mongoose.set('useFindAndModify', false)
console.log('connecting to ', mongoURI)
mongoose.connect(mongoURI, {useNewUrlParser: true})
  .then( ()=> { console.log('connected to MongoDB') } )
  .catch( (error)=> { console.log('error connecting to MongoDB: ', error.message) } )

const typeDefs = gql`

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favouriteGenre: String!
    ): User!
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    hello: String!
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    findBook(author: String!): [Book!]!
    me: User
  }

  type Subscription {
    bookAdded: Book!
  }

`

const resolvers = {
  Query: {
    hello: () => { return "world" },
    bookCount: async() => { const books = await Book.find({}); return await books.length },
    authorCount: async() => { const authors = await Author.find({}); return authors.length },
    allBooks: async(root,args) => { const books = await allBooks(args); return books }, //osittain
    allAuthors: () => { return allAuthors() },
    //findBook: (root,args) => { return books.find(p=>p.author === args.author) }, //odota
    findBook: async(root,args) => {
      const author = await Author.findOne({name:args.author})
      if(!author)throw new UserInputError('No results')
      const o_id = mongoose.Types.ObjectId(author._id)
      const books = await Book.find({author:o_id})
      if(books)return books
      else throw new UserInputError('No results')
    },
    me: (root,args,context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async(root,args,context) => {
      if(!context.currentUser)throw new UserInputError('Wrong credentials')

      let author = await Author.findOne({ name:args.author })
      let book = await Book.findOne({ title:args.title })
      if(!author && !book){
        author = await addAuthor(args.author)
      }
      if(author && !book){
        const newBook = new Book({
          title:args.title,
          author:author,
          published: args.published ? args.published : null,
          genres:args.genres
        })
        try{
          await newBook.save()
        }catch(error){
          throw new UserInputError(error.message,{
            invalidArgs: args,
          })
        }
        pubsub.publish('BOOK_ADDED',{bookAdded:newBook})
        return newBook
      }
    },
    editAuthor: async(root,args,context) => {
      if(!context.currentUser)throw new UserInputError('Wrong credentials')

      const result = await editAuthor(args)
      if(result) return {name:args.name,born:args.setBornTo}
      else return null
    },
    createUser: async(root,args) => {
      const user = new User({username:args.username,favouriteGenre:args.favouriteGenre})
      try {
        const result = await user.save()
        return result
      } catch (error) {
        throw new UserInputError(error.message,{
          invalidArgs:args.username
        })
      }
    },
    login: async(root,args) => {
      const user = await User.findOne({username:args.username})
      if(!user || args.password !== tempPassword ){
        throw new UserInputError('Wrong credentials')
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, JWT_SECRET)}
    }
  },
  Subscription:{
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const editAuthor = async(args) => {
  const result = await Author.updateOne({name:args.name},{born:Number(args.setBornTo)})
  return args
}

const addAuthor = async(author) => {
  const newAuthor = new Author({name:author})
  try {
    await newAuthor.save()
    return newAuthor
  } catch (error) {
    throw new UserInputError(error.message,{
      invalidArgs:author
    })
  }
  return null
}

const replaceAuthor = async(books) => {
  const newBooks = books.map( async(book) => {
    const author = await Author.findOne({_id:String(book.author)})
    const newBook = {
      title:book.title,
      published:book.published,
      genres:book.genres,
      id:book.id,
      author:author
    }
    return newBook
  })
  return newBooks
}

const allBooks = async(args) => {
  let books = await Book.find({})
  let filteredBooks = books
  if(!args.author && !args.genre){
    filteredBooks = await replaceAuthor(books)
  }
  else {
    if(args.author)filteredBooks = filteredBooks.filter(book => book.author === args.author)
    if(args.genre)filteredBooks = filteredBooks.filter(book => book.genres.find(genre => genre === args.genre)!==undefined)

    filteredBooks = await replaceAuthor(filteredBooks)
  }
  return filteredBooks
}

const allAuthors = async() => {
  const authors = await Author.find({})
  const books = await Book.find({})
  
  const combinedAuthors = authors.map( author => {
    const bookCount = books.filter(book => String(book.author) == String(author._id)).length
    return {
      name:author.name,
      born:author.born ? author.born : null,
      bookCount:bookCount
    }
  })
  return combinedAuthors
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    const auth = req ? req.headers.authorization : null
    if( auth && auth.toLowerCase().startsWith('bearer ')){
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return {currentUser}
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
