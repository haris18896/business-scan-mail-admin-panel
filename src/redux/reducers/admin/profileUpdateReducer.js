import {
  FETCH_PROFILE_INITIATED,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILED,
  UPDATE_PROFILE_INITIATED,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  RESET_PROFILE_UPDATE_STATE
} from '../../actions/ActionTypes/admin'

export const profileUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_PROFILE_INITIATED: {
      return {
        ...state,
        isFetching: true
      }
    }

    case FETCH_PROFILE_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        profile: action.payload,
        error: null
      }
    }

    case FETCH_PROFILE_FAILED: {
      return {
        ...state,
        isFetching: false,
        error: action.payload,
        success: false
      }
    }

    case UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        success: true,
        profileUpdated: action.payload,
        error: null
      }
    }

    case RESET_PROFILE_UPDATE_STATE: {
      return {
        ...state,
        success: false,
        error: null
      }
    }
    default: {
      return state
    }
  }
}
