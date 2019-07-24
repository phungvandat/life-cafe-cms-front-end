import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getProductsRequest: ['params', 'actionSuccess'],
  getProductsSuccess: ['products', 'total'],
  getProductsFailure: ['error'],

  deleteProductRequest: ['productID', 'index'],
  deleteProductSuccess: ['index'],
  deleteProductFailure: ['error'],
})

export const ProductsTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = fromJS({
  products: [],
  isGettingProducts: false,
  error: null,
  total: 0,
  isDeletingProduct: false,
})

/* ------------- Reducers ------------- */

const getProductsRequest = state => state.merge({
  isGettingProducts: true,
})

const getProductsSuccess = (state, { products, total }) => state.merge({
  isGettingProducts: false,
  products,
  total,
})

const getProductsFailure = (state, { error }) =>
  state.merge({
    isGettingProducts: false,
    error,
  })

const deleteProductRequest = state => state.merge({ isDeletingProduct: true })

const deleteProductSuccess = (state, { index }) => {
  const { products } = state.toJS()
  products.splice(index, 1)

  return state.merge({
    isDeletingProduct: false,
    products,
  })
}

const deleteProductFailure = state => state.merge({ isDeletingProduct: false })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PRODUCTS_REQUEST]: getProductsRequest,
  [Types.GET_PRODUCTS_SUCCESS]: getProductsSuccess,
  [Types.GET_PRODUCTS_FAILURE]: getProductsFailure,

  [Types.DELETE_PRODUCT_REQUEST]: deleteProductRequest,
  [Types.DELETE_PRODUCT_SUCCESS]: deleteProductSuccess,
  [Types.DELETE_PRODUCT_FAILURE]: deleteProductFailure,
})