import {
  GET_ATTACHMENT_FAILED,
  GET_ATTACHMENT_INITIATED,
  GET_ATTACHMENT_SUCCESS,
  RESET_ATTACHMENT
} from '../../actions/ActionTypes/mails'

export const getAttachmentReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ATTACHMENT_INITIATED:
      return { ...state, getAttachmentInProcess: true }
    case GET_ATTACHMENT_SUCCESS:
      return { ...state, getAttachmentInProcess: false, error: null, attachment: action.payload, success: true }
    case GET_ATTACHMENT_FAILED:
      return { ...state, getAttachmentInProcess: false, error: action.payload, success: null, success: false }
    case RESET_ATTACHMENT:
      return {}
    default:
      return state
  }
}
