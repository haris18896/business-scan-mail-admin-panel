import {
  RESET_ADMIN_PASSWORD_UPDATE_STATE,
  UPDATE_ADMIN_PASSWORD_FAILED,
  UPDATE_ADMIN_PASSWORD_INITIATED,
  UPDATE_ADMIN_PASSWORD_SUCCESS
} from '../../actions/ActionTypes/admin'

export const updatePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_ADMIN_PASSWORD_INITIATED:
      return {
        ...state,
        passwordUpdateInProcess: true
      }

    case UPDATE_ADMIN_PASSWORD_SUCCESS:
      return {
        ...state,
        passwordUpdateInProcess: false,
        passwordUpdatedSuccess: action.payload,
        error: null
      }

    case UPDATE_ADMIN_PASSWORD_FAILED:
      return {
        ...state,
        passwordUpdateInProcess: false,
        passwordUpdatedSuccess: false,
        error: action.payload
      }

    case RESET_ADMIN_PASSWORD_UPDATE_STATE:
      return {
        ...state,
        passwordUpdateInProcess: false,
        passwordUpdatedSuccess: false,
        error: null
      }

    default:
      return state
  }
}
