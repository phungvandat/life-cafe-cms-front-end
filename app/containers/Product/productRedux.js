import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({

  getProductRequest: ['productID', 'actionSuccess'],
  getProductSuccess: ['product'],
  getProductFailure: ['error'],

  createProductRequest: ['params', 'actionSuccess'],
  createProductSuccess: ['product'],
  createProductFailure: ['error'],

  updateProductRequest: ['productID', 'params', 'originalProduct', 'actionSuccess'],
  updateProductSuccess: ['product'],
  updateProductFailure: ['error'],

  getCategoriesRequest: ['params', 'actionSuccess'],
  getCategoriesSuccess: ['categories'],
  getCategoriesFailure: ['error'],
})

export const ProductTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = fromJS({
  product: {},
  isGettingProduct: false,
  error: null,

  isCreatingProduct: false,
  isUpdatingProduct: false,

  categories: [],
  isGettingCategories: false,
})

/* ------------- Reducers ------------- */
const getProductRequest = state => state.merge({
  isGettingProduct: true,
})

const getProductSuccess = (state, { product }) => state.merge({
  isGettingProduct: false,
  product,
})

const getProductFailure = (state, { error }) =>
  state.merge({
    isGettingProduct: false,
    error,
  })

const createProductRequest = state => state.merge({
  isCreatingProduct: true,
})

const createProductSuccess = state => state.merge({
  isCreatingProduct: false,
})

const createProductFailure = (state, { error }) => state.merge({
  isCreatingProduct: false,
  error,
})

const updateProductRequest = state => state.merge({
  isUpdatingProduct: true,
})

const updateProductSuccess = (state, { product }) => state.merge({
  isUpdatingProduct: false,
  product,
})

const updateProductFailure = (state, { error }) => state.merge({
  isUpdatingProduct: false,
  error,
})

const getCategoriesRequest = state => state.merge({
  isGettingCategories: true,
})

const getCategoriesSuccess = (state, { categories }) => state.merge({
  isGettingCategories: false,
  categories,
})

const getCategoriesFailure = (state, { error }) =>
  state.merge({
    isGettingCategories: false,
    error,
  })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PRODUCT_REQUEST]: getProductRequest,
  [Types.GET_PRODUCT_SUCCESS]: getProductSuccess,
  [Types.GET_PRODUCT_FAILURE]: getProductFailure,

  [Types.CREATE_PRODUCT_REQUEST]: createProductRequest,
  [Types.CREATE_PRODUCT_SUCCESS]: createProductSuccess,
  [Types.CREATE_PRODUCT_FAILURE]: createProductFailure,

  [Types.UPDATE_PRODUCT_REQUEST]: updateProductRequest,
  [Types.UPDATE_PRODUCT_SUCCESS]: updateProductSuccess,
  [Types.UPDATE_PRODUCT_FAILURE]: updateProductFailure,

  [Types.GET_CATEGORIES_REQUEST]: getCategoriesRequest,
  [Types.GET_CATEGORIES_SUCCESS]: getCategoriesSuccess,
  [Types.GET_CATEGORIES_FAILURE]: getCategoriesFailure,
})