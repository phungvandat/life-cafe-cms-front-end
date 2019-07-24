import {
  takeLatest,
  all,
  call,
  put,
} from 'redux-saga/effects'
import loIsEqual from 'lodash/isEqual'
import loGet from 'lodash/get'
import { push } from 'react-router-redux'
import ProductActions, { ProductTypes } from './productRedux'
import AppActions from '../../redux/appRedux'
import * as api from './productApi'
import imageApi from '../../services/imageApi'

function* productRootSagas() {
  yield all([
    yield takeLatest(ProductTypes.GET_PRODUCT_REQUEST,
      getProductRequest),
    yield takeLatest(ProductTypes.GET_PRODUCT_REQUEST,
      getProductRequest),
    yield takeLatest(ProductTypes.CREATE_PRODUCT_REQUEST,
      createProductRequest),
    yield takeLatest(ProductTypes.UPDATE_PRODUCT_REQUEST,
      updateProductRequest),
    yield takeLatest(ProductTypes.GET_CATEGORIES_REQUEST,
      getCategoriesRequest),
  ])

}

function* getProductRequest({ productID, actionSuccess }) {
  try {
    const { product } = yield call(api.getProduct, productID)
    yield put(ProductActions.getProductSuccess())
    if (actionSuccess) actionSuccess(product)
  } catch (error) {
    yield put(ProductActions.getProductFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* createProductRequest({ params, actionSuccess }) {
  try {
    const { mainPhotoSelected,
      subPhotosSelected } = params

    if (subPhotosSelected.length > 0) {
      const subPhotos = []
      for (let i = 0; i < subPhotosSelected.length; i++) {
        const image = subPhotosSelected[i]
        const links = yield call(imageApi.uploadImages, [image.value])
        subPhotos.push({
          id: image.name,
          url: links[0],
        })
      }
      params.subPhotos = subPhotos
    } else {
      params.subPhotos = []
    }

    // upload main photo
    const links = yield call(imageApi.uploadImages, [mainPhotoSelected])
    params.mainPhoto = links[0]

    delete params.subPhotosSelected
    delete params.mainPhotoSelected
    yield call(api.createProduct, params)

    yield put(ProductActions.createProductSuccess())
    yield put(AppActions.showSuccessRequest('Success'))
    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(ProductActions.createProductFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* updateProductRequest({ productID, params, originalProduct, actionSuccess }) {
  try {
    const {
      name,
      mainPhotoSelected,
      subPhotos,
      subPhotosSelected,
      quantity,
      description,
      categoryIDs,
      price,
      barcode,
    } = params

    if (name === originalProduct.name) delete params.name
    if (quantity === originalProduct.quantity) delete params.quantity
    if (description === originalProduct.description) delete params.description
    if (price === originalProduct.price) delete params.price
    if (barcode === originalProduct.barcode) delete params.barcode

    const originalCategoryIds = loGet(originalProduct, ['categories', 'length']) > 0 ?
      originalProduct.categories.map(item => item.id) : []
    if (loIsEqual(categoryIDs.sort(), originalCategoryIds.sort())) {
      delete params.categoryIDs
    }

    if (mainPhotoSelected) {
      const links = yield call(imageApi.uploadImages, [mainPhotoSelected])
      params.mainPhoto = links[0]
    } else {
      delete params.mainPhoto
    }

    if (subPhotosSelected.length > 0) {
      
      const createSubPhotos = []
      for (let i = 0; i < subPhotosSelected.length; i++) {
        const image = subPhotosSelected[i]

        const links = yield call(imageApi.uploadImages, [image.value])

        createSubPhotos.push({
          id: image.name,
          url: links[0],
        })
      }
      subPhotos.forEach((photo) => {
        createSubPhotos.forEach((image, idx) => {
          if (photo.id === image.id) {
            photo.url = image.url // eslint-disable-line
            createSubPhotos.splice(idx, 1)
          }
        })
      })
      
      params.subPhotos = subPhotos.concat(createSubPhotos)
    } else {
      const subPhotos = params.subPhotos || []
      params.subPhotos = subPhotos.filter(item => item.url)
    }

    delete params.subPhotosSelected
    delete params.mainPhotoSelected

    const { product } = yield call(api.updateProduct, productID, params)
    yield put(ProductActions.updateProductSuccess(product))
    yield put(AppActions.showSuccessRequest('Success'))

    if (actionSuccess) actionSuccess()
    yield put(push('/products'))
  } catch (error) {
    yield put(ProductActions.updateProductFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* getCategoriesRequest({ params, actionSuccess }) {
  try {
    const { categories } = yield call(api.getCategories, params)
    yield put(ProductActions.getCategoriesSuccess(categories))

    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(ProductActions.getCategoriesFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

export default productRootSagas