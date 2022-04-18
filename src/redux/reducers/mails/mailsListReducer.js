import {
  GET_EMAILS_LIST_FAIL,
  GET_EMAILS_LIST_INITIATED,
  GET_EMAILS_LIST_SUCCESS,
  PAGE_CHANGE,
  REST_GET_EMAILS_LIST
} from '../../actions/ActionTypes/mails'

const initialState = {
  page: 1,
  totalEmails: 0
}

export const getEmailsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_EMAILS_LIST_INITIATED:
      return { ...state, emailInProcess: true, totalEmails: 0 }
    case GET_EMAILS_LIST_FAIL:
      return { ...state, emailInProcess: false, totalEmails: 0, emailsList: {}, error: action.payload }
    case GET_EMAILS_LIST_SUCCESS:
      return { ...state, emailInProcess: false, totalEmails: action.payload.emailsCount, emailsList: action.payload, error: null }

    case PAGE_CHANGE: {
      return { ...state, emailInProcess: true, page: action.payload }
    }

    case REST_GET_EMAILS_LIST:
      return initialState
    default:
      return state
  }
}
