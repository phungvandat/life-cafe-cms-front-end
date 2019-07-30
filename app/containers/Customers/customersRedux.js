import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getCustomersRequest: ['params', 'actionSuccess'],
  getCustomersSuccess: ['customers', 'total'],
  getCustomersFailure: ['error'],

  updateCustomer: ['customer'],
})

export const CustomersTypes = Types
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

const getCustomersSuccess = (state, { customers, total }) =>
  state.merge({
    isGettingCustomers: false,
    customers,
    total,
  })

const getCustomersFailure = (state, { error }) =>
  state.merge({
    error,
    isGettingCustomers: false,
  })

const updateCustomer = (state, { customer }) => {
  const customers = state.get('customers') ? state.get('customers').toJS() : []

  const idx = customers.findIndex(item => item.id === customer.id)

  if (idx >= 0) {
    customers[idx] = customer
  }

  return state.merge({ customers })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE,
  {
    [Types.GET_CUSTOMERS_REQUEST]: getCustomersRequest,
    [Types.GET_CUSTOMERS_SUCCESS]: getCustomersSuccess,
    [Types.GET_CUSTOMERS_FAILURE]: getCustomersFailure,

    [Types.UPDATE_CUSTOMER] : updateCustomer,
  }
)