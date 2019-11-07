const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  let newState = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case 'GOOD':
      newState.good += 1
      return newState
    case 'OK':
      newState.ok += 1
      return newState
    case 'BAD':
      newState.bad += 1
      return newState
    case 'ZERO':
      newState.good = 0
      newState.bad = 0
      newState.ok = 0
      return newState
    default: return newState
  }
  
}

export default counterReducer