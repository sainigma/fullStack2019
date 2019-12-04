import React, {useState} from 'react'

const Login = (props) => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  if (!props.show) {
    return null
  }
  const handleChange = (event) => {
    if(event.target.type==='password')setPassword(event.target.value)
    else setUsername(event.target.value)
  }
  const submit = async(event) => {
    event.preventDefault()
    const request = await props.loginMutator({
      variables: { username, password }
    })
    if(request){
      localStorage.setItem('token', request.data.login.value)
      props.setToken('bearer '+request.data.login.value)
      props.setPage('authors')
    }

  }
  return(
    <div>
      <form onSubmit={submit}>
        <input value={username} onChange={handleChange}/><br/>
        <input password={password} onChange={handleChange} type='password'/><br/>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Login