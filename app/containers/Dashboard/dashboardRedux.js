import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  initDashboard: [],
})

export const DashboardTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = fromJS({})

/* ------------- Reducers ------------- */

const initDashboard = state => state.merge({})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INIT_DASHBOARD]: initDashboard,
})