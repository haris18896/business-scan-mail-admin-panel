import {
  CLEAR_MAILS_DATA_FAILED,
  CLEAR_MAILS_DATA_INITIATED,
  CLEAR_MAILS_DATA_SUCCESS,
  RESET_CLEAR_MAILS_DATA
} from '../../actions/ActionTypes/mails'

export const clearSearchDataReducer = (state = {}, action) => {
  switch (action.type) {
    case CLEAR_MAILS_DATA_INITIATED:
      return { ...state, clearInProcess: true }
    case CLEAR_MAILS_DATA_SUCCESS:
      return { ...state, clearInProcess: false, error: null, searchCleared: action.payload }
    case CLEAR_MAILS_DATA_FAILED:
      return { ...state, clearInProcess: false, error: action.payload, success: null }
    case RESET_CLEAR_MAILS_DATA:
      return {}
    default:
      return state
  }
}
