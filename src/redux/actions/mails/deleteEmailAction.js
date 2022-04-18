import useJwt from '@src/auth/jwt/useJwt'
import {
  DELETE_EMAILS_POST_API_FAILED,
  DELETE_EMAILS_POST_API_INITIATED,
  DELETE_EMAILS_POST_API_SUCCESS,
  RESET_DELETE_EMAILS_POST_API
} from '../ActionTypes/mails'

export const resetDeleteData = () => ({ type: RESET_DELETE_EMAILS_POST_API })
export const deleteEmailsInitiated = () => ({ type: DELETE_EMAILS_POST_API_INITIATED })
export const deleteEmailsSuccess = data => ({ type: DELETE_EMAILS_POST_API_SUCCESS, payload: data })
export const deleteEmailsFailed = error => ({ type: DELETE_EMAILS_POST_API_FAILED, payload: error })

export const handleDeleteEmails = data => {
  return async dispatch => {
    try {
      dispatch(deleteEmailsInitiated())
      const response = await useJwt.deleteEmails(data)
      if (response.data) {
        dispatch(deleteEmailsSuccess(response.data))
      }
    } catch (err) {
      if (err.response) {
        dispatch(deleteEmailsFailed(err.response.data))
      }
    }
  }
}
