import useJwt from '@src/auth/jwt/useJwt'
import { GET_ATTACHMENT_FAILED, GET_ATTACHMENT_INITIATED, GET_ATTACHMENT_SUCCESS, RESET_ATTACHMENT } from '../ActionTypes/mails'

export const resetAttachment = () => ({ type: RESET_ATTACHMENT })
export const getAttachmentInitiated = () => ({ type: GET_ATTACHMENT_INITIATED })
export const getAttachmentSuccess = data => ({ type: GET_ATTACHMENT_SUCCESS, payload: data })
export const getAttachmentFailed = error => ({ type: GET_ATTACHMENT_FAILED, payload: error })

export const handleGetAttachment = data => {
  return async dispatch => {
    try {
      dispatch(getAttachmentInitiated())
      const response = await useJwt.getAttachment(data)
      if (response.data) {
        dispatch(getAttachmentSuccess(response.data))
      }
    } catch (err) {
      if (err.response) {
        dispatch(getAttachmentFailed(err.response.data))
      }
    }
  }
}
