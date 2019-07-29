import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getOrdersRequest: ['params', 'actionSuccess'],
  getOrdersSuccess: ['orders', 'total'],
  getOrdersFailure: ['error'],
})

export const OrdersTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = fromJS({
  orders: [],
  isGettingOrders: false,
  error: null,
  total: 0,
})

/* ------------- Reducers ------------- */

const getOrdersRequest = state => state.merge({
  isGettingOrders: true,
})

const getOrdersSuccess = (state, { orders, total }) => state.merge({
  isGettingOrders: false,
  orders,
  total,
})

const getOrdersFailure = (state, { error }) =>
  state.merge({
    isGettingOrders: false,
    error,
  })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_ORDERS_REQUEST]: getOrdersRequest,
  [Types.GET_ORDERS_SUCCESS]: getOrdersSuccess,
  [Types.GET_ORDERS_FAILURE]: getOrdersFailure,
})