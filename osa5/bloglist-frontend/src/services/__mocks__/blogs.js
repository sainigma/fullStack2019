let token = null

const blogs = [{
  title:'otsikko',
  author:'tekija',
  likes:666,
  url:'http://www.google.com',
  user:{
    username:'testiukkeli',
    name:'Testi Ukkeli',
    id:'12345'
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

const getAll = () => {
  return Promise.resolve(blogs)
}

const setToken = newToken => {
  token = `bearer ${newToken}`
}

export default { getAll, setToken }