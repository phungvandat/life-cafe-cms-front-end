import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signIn: ['params', 'actionSuccess'],
  signInSuccess: ['user'],
  signInFailure: ['error'],

  signOut: null,

})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  isSigninPending: false,
  isSignin: false,
  user: {},
  error: '',
  isFetching: false,
})

/* ------------- Reducers ------------- */

// Handle signin
const signIn = state => state.merge({ isSigninPending: true, isSignin: false })

const signInSuccess = (state, { user }) =>
  state.merge({
    isSigninPending: false,
    isSignin: true,
    user,
  })

const signInFailure = (state, { error }) =>
  state.merge({ isSigninPending: false, isSignin: false, error })

// Logout Handler
const signOut = () => INITIAL_STATE


/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGN_IN]: signIn,
  [Types.SIGN_IN_SUCCESS]: signInSuccess,
  [Types.SIGN_IN_FAILURE]: signInFailure,

  [Types.SIGN_OUT]: signOut,
})

