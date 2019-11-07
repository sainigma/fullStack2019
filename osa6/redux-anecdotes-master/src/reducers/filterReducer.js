const initialState = {
    content:''
}

const filterReducer = (state=initialState,action) => {
    if(action.type==='FILTER'){
        return{
            content:action.content
        }
    }
    return state
}

export const filtering = (content) => {
    return {
        type:"FILTER",
        content:content
    }
}

export default filterReducer