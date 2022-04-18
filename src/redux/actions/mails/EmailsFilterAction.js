import useJwt from '@src/auth/jwt/useJwt'
import {
  RESET_EMAILS_SEARCH,
  SEARCH_EMAIL_LIST_FAILED,
  SEARCH_EMAIL_LIST_INITIATED,
  SEARCH_EMAIL_LIST_SUCCESS
} from '../ActionTypes/mails'

export const resetEmailsFilter = () => ({ type: RESET_EMAILS_SEARCH })
export const emailsFilterInitiated = () => ({ type: SEARCH_EMAIL_LIST_INITIATED })
export const emailsFilterSuccess = data => ({ type: SEARCH_EMAIL_LIST_SUCCESS, payload: data })
export const emailsFilterFailed = error => ({ type: SEARCH_EMAIL_LIST_FAILED, payload: error })

export const handleEmailsFilter = data => {
  return async dispatch => {
    try {
      dispatch(emailsFilterInitiated())
      const response = await useJwt.getEmailsFilter(data)
      if (response.data) {
        dispatch(emailsFilterSuccess(response.data))
      }
    } catch (err) {
      if (err.response) {
        // console.log('err:', err.config)
        dispatch(emailsFilterFailed(err.response.data))
      }
    }
  }
}
