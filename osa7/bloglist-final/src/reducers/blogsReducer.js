import blogService from './../services/blogs'

let sortOrder = 'DESCENDING'

const initialState = [
  {
    likes:0,
    title:'Esimerkkiblog',
    author:'Esimerkkiblogin tekijä',
    url:'http://www.google.com',
    user:{
      username:'eikukaan666',
      name:'Ei Kukaan',
      id:null
    },
    id:null,
    comments:[]
  }]

const sorter = (blogs) => {
  if(sortOrder==='DESCENDING') return blogs.sort((a,b)=>{ return b.likes - a.likes })
  if(sortOrder=== 'ASCENDING') return blogs.sort((a,b)=>{ return a.likes - b.likes })
  if(sortOrder==='NONE') return blogs
}

const blogsReducer = (state=initialState, action) => {
  if(action.type==='LIKE'){
    const selected = state.filter(b=>b.id===action.id)[0]

    let newSelected = JSON.parse(JSON.stringify(selected))
    newSelected.likes = newSelected.likes + 1
    const result = [
      ...state.filter(b=>b.id!==action.id),
      newSelected
    ]
    return sorter(result)
  }
  if(action.type==='INIT'){
    return sorter(action.data)
  }
  if(action.type==='COMMENT'){
    if(action.result===1){
      let selected = state.filter(b=>b.id===action.id)[0]
      const newComments = [
        ...selected.comments,
        action.comment
      ]
      delete selected.comments

      const updatedBlog = {
        ...selected,
        comments:newComments
      }

      const result = [
        ...state.filter(b=>b.id!==action.id),
        updatedBlog
      ]
      return sorter(result)
    }else console.log('jotain meni pieleen')
  }
  if(action.type==='CREATE'){
    if(action.response!==null){
      const result = [
        ...state,
        action.response
      ]
      return sorter(result)
    }
  }
  if(action.type==='DELETE'){
    if(action.result===1){
      const result = [
        ...state.filter(b=>b.id!==action.id),
      ]
      return sorter(result)
    }
  }
  return state
}

export const likeBlog = (id) => {
  return async dispatch => {
    const result = await blogService.likeBlog(id)
    if(result)dispatch({
      type:'LIKE',
      id: id
    })
  }
}

export const initBlogs = () => {
  return async dispatch => {
    const result = await blogService.getAll()
    dispatch({
      type:'INIT',
      data: result,
    })
  }
}

export const sendComment = (id,comment) => {
  return async dispatch => {
    const result = await blogService.newComment(id,comment)
    dispatch({
      type:'COMMENT',
      comment: comment,
      id: id,
      result: result
    })
  }
}

export const sendBlog = (title,author,url) => {
  return async dispatch => {
    const response = await blogService.submitBlog(title,author,url)
    dispatch({
      type:'CREATE',
      response:response
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    const result = await blogService.removeBlog(id)
    dispatch({
      type:'DELETE',
      id:id,
      result:result
    })
  }
}

export default blogsReducer