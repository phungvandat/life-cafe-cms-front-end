import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  getCustomersRequest: ['params', 'actionSuccess'],
  getCustomersSuccess: ['customers', 'total'],
  getCustomersFailure: ['error'],
})

export const CustomersTypes= Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = fromJS({
  customers: [],
  isGettingCustomers: false,
  error: null,
  total: 0,
})

/* ------------- Reducers ------------- */

const getCustomersRequest = state => state.merge({
  isGettingCustomers: true,
})

const getCustomersSuccess = (state, {customers, total}) =>
  state.merge({
    isGettingCustomers: false,
    customers,
    total,
  })

const getCustomersFailure = (state, {error}) => 
  state.merge({
    error,
    isGettingCustomers: false,
  })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE,
  {
    [Types.GET_CUSTOMERS_REQUEST]: getCustomersRequest,
    [Types.GET_CUSTOMERS_SUCCESS]: getCustomersSuccess,
    [Types.GET_CUSTOMERS_FAILURE]: getCustomersFailure,
  }
)