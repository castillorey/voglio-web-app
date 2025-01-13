import { Link } from 'react-router-dom'

function home() {
  return (
    <div>
      <Link to={"/register"}>Register</Link>
      <br></br>
      <Link to={"/login"}>Login</Link>
    </div>
  )
}

export default home