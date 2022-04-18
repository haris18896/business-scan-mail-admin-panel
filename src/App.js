// ** Router Import
import Router from './router/Router'
import useJwt from '@src/auth/jwt/useJwt'
import jwt_decode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { LOGIN_SUCCESS } from './redux/actions/ActionTypes/admin'

const App = () => {
  const dispatch = useDispatch()
  const currentSkin = localStorage.getItem('skin')

  if (useJwt.getToken()) {
    const token = useJwt.getToken()
    const decoded = jwt_decode(token)
    dispatch({ type: LOGIN_SUCCESS, payload: decoded })
  }

  if (currentSkin) {
    dispatch({ type: 'SET_SKIN', payload: JSON.parse(currentSkin) })
  }

  return <Router />
}

export default App
