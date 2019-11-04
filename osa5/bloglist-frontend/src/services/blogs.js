import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const removeBlog = async(blogId) => {
  const config = {
    headers:{ Authorization:token }
  }
  const response = await axios.delete(baseUrl+'/'+blogId,config)
  if(response.status === 200) return 1
  else return 0
}

//huom toteutin backendissä päivityksen postilla, siten että pelkkä ID, creds + likes riittää
const likeBlog = async(blogId) => {
  const config = {
    headers: { Authorization: token },
  }
  const message = {
    likes:1
  }
  const response = await axios.post(baseUrl+'/'+blogId,message,config)
  if(response.status === 200) return 1
  else return 0
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const submitBlog = async(title,author,url) => {
  const config = {
    headers: { Authorization: token },
  }
  const newBlog = {
    title:title,
    author:author,
    url:url,
  }
  const response = await axios.post(baseUrl, newBlog, config)
  if(response.status === 200) return response.data
  else return null
}

export default { getAll, setToken, submitBlog, likeBlog, removeBlog }