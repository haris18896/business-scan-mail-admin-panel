import useJwt from '@src/auth/jwt/useJwt'
import {
  CLEAR_MAILS_DATA_FAILED,
  CLEAR_MAILS_DATA_INITIATED,
  CLEAR_MAILS_DATA_SUCCESS,
  RESET_CLEAR_MAILS_DATA
} from '../ActionTypes/mails'

export const resetClearStates = () => ({ type: RESET_CLEAR_MAILS_DATA })
export const clearSearchDataInitiated = () => ({ type: CLEAR_MAILS_DATA_INITIATED })
export const clearSearchDataSuccess = data => ({ type: CLEAR_MAILS_DATA_SUCCESS, payload: data })
export const clearSearchDataFailed = error => ({ type: CLEAR_MAILS_DATA_FAILED, payload: error })

export const handleClearSearchData = () => {
  return async dispatch => {
    try {
      dispatch(clearSearchDataInitiated())
      const response = await useJwt.clearSearchData()
      if (response.data) {
        dispatch(clearSearchDataSuccess(response.data))
      }
    } catch (err) {
      if (err.response) {
        dispatch(clearSearchDataFailed(err.response.data))
      }
    }
  }
}
