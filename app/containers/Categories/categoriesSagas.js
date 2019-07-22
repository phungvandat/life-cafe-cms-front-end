import {
  takeLatest,
  all,
  call,
  put,
} from 'redux-saga/effects'
import CategoriesActions, { CategoriesTypes } from './categoriesRedux'
import AppActions from '../../redux/appRedux'
import * as api from './categoriesApi'

function* categoriesRootSagas() {
  yield all([
    yield takeLatest(CategoriesTypes.GET_CATEGORIES_REQUEST,
      getCategoriesRequest),
    yield takeLatest(CategoriesTypes.GET_CATEGORY_REQUEST,
      getCategoryRequest),
    yield takeLatest(CategoriesTypes.CREATE_CATEGORY_REQUEST,
      createCategoryRequest),
    yield takeLatest(CategoriesTypes.UPDATE_CATEGORY_REQUEST,
      updateCategoryRequest),
  ])

}

function* getCategoriesRequest({ params, actionSuccess }) {
  try {
    const { categories } = yield call(api.getCategories, params)
    yield put(CategoriesActions.getCategoriesSuccess(categories))
    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(CategoriesActions.getCategoriesFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* getCategoryRequest({ categoryID, actionSuccess }) {
  try {
    const { report } = yield call(api.getCategory, categoryID)

    yield put(CategoriesActions.getCategorySuccess(report))
    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(CategoriesActions.getCategoryFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* createCategoryRequest({ params, actionSuccess }) {
  try {
    const { photoSelected } = params
    if (photoSelected) {
      const formDataPhoto = new FormData()
      formDataPhoto.append('images', photoSelected)
      const { links } = yield call(api.uploadImages, formDataPhoto)
      params.photo = links[0]
    }
    yield call(api.createCategory, params)

    yield put(CategoriesActions.createCategorySuccess())
    yield put(AppActions.showSuccessRequest('Success'))
    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(CategoriesActions.createCategoryFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* updateCategoryRequest({ categoryID, params, originalCategory, actionSuccess }) {
  try {
    const {
      name,
      slug,
      parentCategoryID,
      photoSelected,
    } = params
    if ((name && name !== originalCategory.name) ||
      (parentCategoryID !== originalCategory.parentCategory) ||
      (slug && slug !== originalCategory.slug) || photoSelected) {
      if (photoSelected) {
        const formDataPhoto = new FormData()
        formDataPhoto.append('images', photoSelected)
        const { links } = yield call(api.uploadImages, formDataPhoto)
        params.photo = links[0]
      }

      yield call(api.updateCategory, categoryID, params)
      yield put(AppActions.showSuccessRequest('Success'))
      if (actionSuccess) actionSuccess()
    }
    yield put(CategoriesActions.updateCategorySuccess())
  } catch (error) {
    yield put(CategoriesActions.updateCategoryFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

export default categoriesRootSagas