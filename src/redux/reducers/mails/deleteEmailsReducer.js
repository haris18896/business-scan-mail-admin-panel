import {
  DELETE_EMAILS_POST_API_FAILED,
  DELETE_EMAILS_POST_API_INITIATED,
  DELETE_EMAILS_POST_API_SUCCESS,
  RESET_DELETE_EMAILS_POST_API
} from '../../actions/ActionTypes/mails'

export const deleteEmailsReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_EMAILS_POST_API_INITIATED:
      return { ...state, deleteEmailInProcess: true }
    case DELETE_EMAILS_POST_API_SUCCESS:
      return { ...state, deleteEmailInProcess: false, emailDeleted: action.payload, error: null }

    case DELETE_EMAILS_POST_API_FAILED:
      return { ...state, deleteEmailInProcess: false, error: action.payload, emailDeleted: null }

    case RESET_DELETE_EMAILS_POST_API:
      return {}
    default:
      return state
  }
}
