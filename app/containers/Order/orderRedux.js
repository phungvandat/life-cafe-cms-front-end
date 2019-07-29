import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({

  getCustomerBaseOnPhone: ['phoneNumber'],
  getCustomerBaseOnPhoneSuccess: ['customers'],
  getCustomerBaseOnPhoneFailure: ['error'],

  getCustomerBaseOnID: ['customerID', 'actionSuccess'],
  getCustomerBaseOnIDSuccess: null,
  getCustomerBaseOnIDFailure: ['error'],

  getProductsToOrderRequest: ['params', 'actionSuccess'],
  getProductsToOrderSuccess: ['products'],
  getProductsToOrderFailure: ['error'],

  createOrderRequest: ['params', 'actionSuccess'],
  createOrderSuccess: null,
  createOrderFailure: ['error'],

  getOrderRequest: ['orderID', 'actionSuccess'],
  getOrderSuccess: ['order'],
  getOrderFailure: ['error'],

  updateOrderRequest: ['orderID', 'params', 'originalOrder', 'actionSuccess'],
  updateOrderSuccess: null,
  updateOrderFailure: ['error'],

  updateOrderProduct: ['product'],
})

export const OrderTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  isGettingCustomers: false,
  isGettingCustomer: false,
  isGettingCustomerSources: false,
  getCustomerBaseOnIDPending: false,
  customers: [],
  customerSources: [],

  error: '',
  products: [],
  isGettingProducts: false,

  isCreatingOrder: false,
  order: {},
  isGettingOrder: false,
})

/* ------------- Reducers ------------- */

// Handle getting customers base on their phoneNumber
const getCustomerBaseOnPhone = state =>
  state.merge({ isGettingCustomers: true })

const getCustomerBaseOnPhoneSuccess = (state, { customers }) =>
  state.merge({
    isGettingCustomers: false,
    customers,
  })

const getCustomerBaseOnPhoneFailure = (state, { error }) =>
  state.merge({ isGettingCustomers: false, error })

// Handle getting customers base on conversation
const getCustomerBaseOnID = state =>
  state.merge({ getCustomerBaseOnIDPending: true })

const getCustomerBaseOnIDSuccess = (state) =>
  state.merge({ getCustomerBaseOnIDPending: false })

const getCustomerBaseOnIDFailure = (state, { error }) =>
  state.merge({ getCustomerBaseOnIDPending: false, error })

const getProductsToOrderRequest = state => state.merge({
  isGettingProducts: true,
})

const getProductsToOrderSuccess = (state, { products }) => state.merge({
  isGettingProducts: false,
  products,
})

const getProductsToOrderFailure = (state, { error }) =>
  state.merge({
    isGettingProducts: false,
    error,
  })

const createOrderRequest = (state) => state.merge({
  isCreatingOrder: true,
})

const createOrderSuccess = (state) => state.merge({
  isCreatingOrder: false,
})

const createOrderFailure = (state, { error }) => state.merge({
  isCreatingOrder: false,
  error,
})

const getOrderRequest = (state) => state.merge({
  isGettingOrder: true,
})

const getOrderSuccess = (state, { order }) => state.merge({
  isGettingOrder: false,
  order,
})

const getOrderFailure = (state, { error }) => state.merge({
  isGettingOrder: false,
  error,
})

const updateOrderRequest = (state) => state.merge({
  isUpdatingOrder: true,
})

const updateOrderSuccess = (state) => state.merge({
  isUpdatingOrder: false,
})

const updateOrderFailure = (state, { error }) => state.merge({
  isUpdatingOrder: false,
  error,
})

const updateOrderProduct = (state, { product }) => {
  const products = state.get('products') ? state.get('products').toJS() : []
  const idx = products.findIndex(item => item.id === product.id)
  if (idx >= 0) {
    products[idx] = product
  }
  return state.merge({ products })
}

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CUSTOMER_BASE_ON_PHONE]: getCustomerBaseOnPhone,
  [Types.GET_CUSTOMER_BASE_ON_PHONE_SUCCESS]: getCustomerBaseOnPhoneSuccess,
  [Types.GET_CUSTOMER_BASE_ON_PHONE_FAILURE]: getCustomerBaseOnPhoneFailure,

  [Types.GET_CUSTOMER_BASE_ON_ID]: getCustomerBaseOnID,
  [Types.GET_CUSTOMER_BASE_ON_ID_SUCCESS]: getCustomerBaseOnIDSuccess,
  [Types.GET_CUSTOMER_BASE_ON_ID_FAILURE]: getCustomerBaseOnIDFailure,

  [Types.GET_PRODUCTS_TO_ORDER_REQUEST]: getProductsToOrderRequest,
  [Types.GET_PRODUCTS_TO_ORDER_SUCCESS]: getProductsToOrderSuccess,
  [Types.GET_PRODUCTS_TO_ORDER_FAILURE]: getProductsToOrderFailure,

  [Types.CREATE_ORDER_REQUEST]: createOrderRequest,
  [Types.CREATE_ORDER_SUCCESS]: createOrderSuccess,
  [Types.CREATE_ORDER_FAILURE]: createOrderFailure,

  [Types.GET_ORDER_REQUEST]: getOrderRequest,
  [Types.GET_ORDER_SUCCESS]: getOrderSuccess,
  [Types.GET_ORDER_FAILURE]: getOrderFailure,

  [Types.UPDATE_ORDER_REQUEST]: updateOrderRequest,
  [Types.UPDATE_ORDER_SUCCESS]: updateOrderSuccess,
  [Types.UPDATE_ORDER_FAILURE]: updateOrderFailure,

  [Types.UPDATE_ORDER_PRODUCT]: updateOrderProduct,
})
