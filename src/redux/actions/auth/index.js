// ** UseJWT import to get config
import jwt_decode from 'jwt-decode'
import useJwt from '@src/auth/jwt/useJwt'
import { LOGIN_FAILED, LOGIN_INITIATED, LOGIN_SUCCESS, LOGOUT_SUCCESSFUL } from '../ActionTypes/admin'
import { getHomeRouteForLoggedInUser } from '../../../utility/Utils'

export const initiateLogin = () => ({ type: LOGIN_INITIATED })

export const loginSuccess = data => ({ type: LOGIN_SUCCESS, payload: data })

export const loginFailed = data => ({ type: LOGIN_FAILED, payload: data })

export const logoutSuccess = () => ({ type: LOGOUT_SUCCESSFUL })

export const handleLogin = (data, history) => {
  return async dispatch => {
    try {
      dispatch(initiateLogin())
      const response = await useJwt.login(data)
      if (response.data) {
        const { token } = response.data
        useJwt.setToken(token)
        const decoded = jwt_decode(token)
        dispatch(loginSuccess(decoded))
        history.push(getHomeRouteForLoggedInUser(decoded.role))
      }
    } catch (err) {
      if (err.response) {
        dispatch(loginFailed(err.response.data))
      }
    }
  }
}

export const handleLogout = () => {
  return dispatch => {
    localStorage.removeItem('accessToken')
    dispatch(logoutSuccess())
  }
}
