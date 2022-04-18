// **  Initial State
const initialState = {}

const skinReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SKIN': {
      return {
        ...state,
        currentSkin: action.payload
      }
    }
    default:
      return state
  }
}

export default skinReducer
