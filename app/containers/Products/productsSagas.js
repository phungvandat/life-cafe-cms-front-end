import {
  takeLatest,
  all,
  call,
  put,
} from 'redux-saga/effects'
import ProductsActions, { ProductsTypes } from './productsRedux'
import AppActions from '../../redux/appRedux'
import * as api from './productsApi'

function* productsRootSagas() {
  yield all([
    yield takeLatest(ProductsTypes.GET_PRODUCTS_REQUEST,
      getProductsRequest),
    yield takeLatest(ProductsTypes.DELETE_PRODUCT_REQUEST,
      deleteProductRequest),
  ])

}

function* getProductsRequest({ params, actionSuccess }) {
  try {
    const { products, total } = yield call(api.getProducts, params)
    yield put(ProductsActions.getProductsSuccess(products, total))
    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(ProductsActions.getProductsFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* deleteProductRequest({ productID, index }) {
  try {
    const { message } = yield call(api.deleteProduct, productID)
    yield put(AppActions.showSuccessRequest(message))
    yield put(ProductsActions.deleteProductSuccess(index))
  } catch (error) {
    yield put(ProductsActions.deleteProductFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

export default productsRootSagas