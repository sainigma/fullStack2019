import axios from 'axios'
import jsonUrl from './jsonUrl'
//const baseUrl = 'http://localhost:3003/api/blogs'
const baseUrl = jsonUrl+'/api/blogs'

let token = null

const setToken = (rawtoken) => {
  token = `bearer ${rawtoken}`
}

const config = () => {
  return {
    headers: { Authorization: token }
  }
}

const removeBlog = async(blogId) => {
  const response = await axios.delete(baseUrl+'/'+blogId,config())
  if(response.status === 200) return 1
  else return 0
}

const newComment = async(blogId,comment) => {
  const message = {
    comment: comment
  }
  const response = await axios.post(baseUrl + '/' + blogId + '/comments', message, config())
  if (response.status === 200) return 1
  else return 0
}

const submitBlog = async(title,author,url) => {
  const newBlog = {
    title:title,
    author:author,
    url:url,
  }
  const response = await axios.post(baseUrl, newBlog, config())
  if(response.status === 200) return response.data
  else return null
}

const likeBlog = async (blogId) => {
  const message = {
    likes: 1
  }
  const response = await axios.post(baseUrl + '/' + blogId, message, config())
  if (response.status === 200) return 1
  else return 0
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default {
  getAll,
  likeBlog,
  setToken,
  newComment,
  removeBlog,
  submitBlog

}