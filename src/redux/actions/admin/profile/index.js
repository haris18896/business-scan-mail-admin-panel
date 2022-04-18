import useJwt from '@src/auth/jwt/useJwt'
import {
  FETCH_PROFILE_FAILED,
  FETCH_PROFILE_INITIATED,
  FETCH_PROFILE_SUCCESS,
  RESET_PROFILE_UPDATE_STATE,
  UPDATE_PROFILE_SUCCESS
} from '../../ActionTypes/admin'

export const fetchProfileInitiate = () => ({ type: FETCH_PROFILE_INITIATED })

export const fetchProfileSuccess = data => ({ type: FETCH_PROFILE_SUCCESS, payload: data })

export const fetchProfileFailed = data => ({ type: FETCH_PROFILE_FAILED, payload: data })

export const updateProfileSuccess = data => ({ type: UPDATE_PROFILE_SUCCESS, payload: data })

export const resetState = () => ({ type: RESET_PROFILE_UPDATE_STATE })

export const handleFetchProfile = () => {
  return async dispatch => {
    try {
      dispatch(fetchProfileInitiate())
      const response = await useJwt.fetchProfile()
      if (response.data) {
        dispatch(fetchProfileSuccess(response.data.profile))
      }
    } catch (err) {
      if (err.response) {
        dispatch(fetchProfileFailed(err.response.data))
      }
    }
  }
}

export const handleUpdateProfile = data => {
  return async dispatch => {
    try {
      dispatch(fetchProfileInitiate())
      const response = await useJwt.updateProfile(data)
      if (response.data) {
        dispatch(updateProfileSuccess(response.data.profile))
      }
    } catch (err) {
      if (err.response) {
        dispatch(fetchProfileFailed(err.response.data))
      }
    }
  }
}
