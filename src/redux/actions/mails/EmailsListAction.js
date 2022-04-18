import useJwt from '@src/auth/jwt/useJwt'
import {
  GET_EMAILS_LIST_FAIL,
  GET_EMAILS_LIST_INITIATED,
  GET_EMAILS_LIST_SUCCESS,
  PAGE_CHANGE,
  REST_GET_EMAILS_LIST
} from '../ActionTypes/mails'

export const emailsPageChange = data => ({ type: PAGE_CHANGE, payload: data })
export const resetEmailsList = () => ({ type: REST_GET_EMAILS_LIST })

export const emailsListInitiated = () => ({ type: GET_EMAILS_LIST_INITIATED })
export const emailsListSuccess = data => ({ type: GET_EMAILS_LIST_SUCCESS, payload: data })
export const emailListFailed = data => ({ type: GET_EMAILS_LIST_FAIL, payload: data })

export const handleEmailsList = (exportId, page) => {
  return async dispatch => {
    try {
      dispatch(emailsListInitiated())
      const response = await useJwt.getEmailsList(exportId, page)
      if (response.data) {
        dispatch(emailsListSuccess(response.data))
      }
    } catch (err) {
      if (err.response) {
        dispatch(emailListFailed(err.response.data))
      }
    }
  }
}

export const handlePageChange = (exportId, page) => {
  return async dispatch => {
    const newPage = page.selected + 1
    dispatch(emailsPageChange(newPage))
    dispatch(handleEmailsList(exportId, newPage))
  }
}
