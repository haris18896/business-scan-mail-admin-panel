import {
  RESET_EMAILS_SEARCH,
  SEARCH_EMAIL_LIST_FAILED,
  SEARCH_EMAIL_LIST_INITIATED,
  SEARCH_EMAIL_LIST_SUCCESS
} from '../../actions/ActionTypes/mails'

export const emailsFilterReducer = (state = {}, action) => {
  switch (action.type) {
    case SEARCH_EMAIL_LIST_INITIATED:
      return { ...state, filterInProcess: true }

    case SEARCH_EMAIL_LIST_SUCCESS:
      return {
        ...state,
        filterInProcess: false,
        clearList: false,
        error: null,
        exportId: action.payload.exportId,
        emailFiltered: action.payload
      }
    case SEARCH_EMAIL_LIST_FAILED:
      return { ...state, filterInProcess: false, clearList: true, emailFiltered: {}, exportId: null, error: action.payload }

    case RESET_EMAILS_SEARCH:
      return {}

    default:
      return state
  }
}
