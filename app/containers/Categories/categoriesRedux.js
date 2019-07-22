import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getCategoriesRequest: ['params', 'actionSuccess'],
  getCategoriesSuccess: ['categories'],
  getCategoriesFailure: ['error'],

  getCategoryRequest: ['categoryID', 'actionSuccess'],
  getCategorySuccess: ['category'],
  getCategoryFailure: ['error'],

  createCategoryRequest: ['params', 'actionSuccess'],
  createCategorySuccess: ['category'],
  createCategoryFailure: ['error'],

  updateCategoryRequest: ['categoryID', 'params', 'originalCategory', 'actionSuccess'],
  updateCategorySuccess: null,
  updateCategoryFailure: ['error'],
})

export const CategoriesTypes = Types
export default Creators

/* ------------- Initial State ------------- */
export const INITIAL_STATE = fromJS({
  categories: [],
  isGettingCategories: false,
  error: null,

  category: {},
  isGettingCategory: false,

  isCreatingCategory: false,
  isUpdatingCategory: false,
})

/* ------------- Reducers ------------- */

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


const getCategoryRequest = state => state.merge({
  isGettingCategory: true,
})

const getCategorySuccess = (state, { category }) => state.merge({
  isGettingCategory: false,
  category,
})

const getCategoryFailure = (state, { error }) =>
  state.merge({
    isGettingCategory: false,
    error,
  })

const createCategoryRequest = state => state.merge({
  isCreatingCategory: true,
})

const createCategorySuccess = state => state.merge({
  isCreatingCategory: false,
})

const createCategoryFailure = (state, { error }) => state.merge({
  isCreatingCategory: false,
  error,
})

const updateCategoryRequest = state => state.merge({
  isUpdatingCategory: true,
})

const updateCategorySuccess = state => state.merge({
  isUpdatingCategory: false,
})

const updateCategoryFailure = (state, { error }) => state.merge({
  isUpdatingCategory: false,
  error,
})

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_CATEGORIES_REQUEST]: getCategoriesRequest,
  [Types.GET_CATEGORIES_SUCCESS]: getCategoriesSuccess,
  [Types.GET_CATEGORIES_FAILURE]: getCategoriesFailure,

  [Types.GET_CATEGORY_REQUEST]: getCategoryRequest,
  [Types.GET_CATEGORY_SUCCESS]: getCategorySuccess,
  [Types.GET_CATEGORY_FAILURE]: getCategoryFailure,

  [Types.CREATE_CATEGORY_REQUEST]: createCategoryRequest,
  [Types.CREATE_CATEGORY_SUCCESS]: createCategorySuccess,
  [Types.CREATE_CATEGORY_FAILURE]: createCategoryFailure,

  [Types.UPDATE_CATEGORY_REQUEST]: updateCategoryRequest,
  [Types.UPDATE_CATEGORY_SUCCESS]: updateCategorySuccess,
  [Types.UPDATE_CATEGORY_FAILURE]: updateCategoryFailure,
})