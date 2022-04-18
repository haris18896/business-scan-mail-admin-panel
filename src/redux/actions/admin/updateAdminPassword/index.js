import useJwt from '@src/auth/jwt/useJwt'

import {
  UPDATE_ADMIN_PASSWORD_INITIATED,
  UPDATE_ADMIN_PASSWORD_SUCCESS,
  UPDATE_ADMIN_PASSWORD_FAILED,
  RESET_ADMIN_PASSWORD_UPDATE_STATE
} from '../../ActionTypes/admin'

export const updatePasswordInitiated = () => ({ type: UPDATE_ADMIN_PASSWORD_INITIATED })
export const updatePasswordSuccess = data => ({ type: UPDATE_ADMIN_PASSWORD_SUCCESS, payload: data })
export const updatePasswordFailed = data => ({ type: UPDATE_ADMIN_PASSWORD_FAILED, payload: data })
export const resetState = () => ({ type: RESET_ADMIN_PASSWORD_UPDATE_STATE })

export const handleUpdatePassword = data => {
  return async dispatch => {
    try {
      dispatch(updatePasswordInitiated())
      const response = await useJwt.updatePassword(data)
      if (response.data) {
        dispatch(updatePasswordSuccess(response.data))
      }
    } catch (err) {
      if (err.response) {
        dispatch(updatePasswordFailed(err.response.data))
      }
    }
  }
}
