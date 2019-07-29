import { takeLatest, all, call, put } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import loGet from 'lodash/get'
import OrderActions, { OrderTypes } from './orderRedux'
import api from './orderApi'
import AppActions from '../../redux/appRedux'

function* productRootSagas() {
  yield all([
    yield takeLatest(OrderTypes.GET_CUSTOMER_BASE_ON_PHONE, getCustomerBaseOnPhone),
    yield takeLatest(OrderTypes.GET_CUSTOMER_BASE_ON_ID, getCustomerBaseOnID),
    yield takeLatest(OrderTypes.GET_PRODUCTS_TO_ORDER_REQUEST, getProductsToOrderRequest),
    yield takeLatest(OrderTypes.CREATE_ORDER_REQUEST, createOrderRequest),
    yield takeLatest(OrderTypes.GET_ORDER_REQUEST, getOrderRequest),
    yield takeLatest(OrderTypes.UPDATE_ORDER_REQUEST, updateOrderRequest),
  ])
}

function* getCustomerBaseOnPhone({ phoneNumber }) {
  try {
    const { users } = yield call(api.getCustomerBaseOnPhone, phoneNumber)
    const customers = users
    if (customers.length > 0) {
      customers[0].isFound = true
      customers[0].phoneNumber = phoneNumber
    }
    else {
      customers.push({})
      customers[0].phoneNumber = phoneNumber
      customers[0].isFound = false
    }
    yield put(OrderActions.getCustomerBaseOnPhoneSuccess(customers))
  } catch (error) {
    yield put(OrderActions.getCustomerBaseOnPhoneFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* getCustomerBaseOnID({ customerID, actionSuccess }) {
  try {
    const { users } = yield call(api.getCustomerBaseOnID, customerID)
    yield put(OrderActions.getCustomerBaseOnIDSuccess())
    if (actionSuccess) actionSuccess(users)
  } catch (error) {
    yield put(OrderActions.getCustomerBaseOnIDFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* getProductsToOrderRequest({ params, actionSuccess }) {
  try {
    const { products } = yield call(api.getProductsToOrder, params)
    yield put(OrderActions.getProductsToOrderSuccess(products))
    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(OrderActions.getProductsToOrderFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* createOrderRequest({ params, actionSuccess }) {
  try {
    yield call(api.createOrder, params)

    yield put(OrderActions.createOrderSuccess())
    yield put(AppActions.showSuccessRequest('Success'))

    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(OrderActions.createOrderFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* getOrderRequest({ orderID, actionSuccess }) {
  try {
    const { order } = yield call(api.getOrder, orderID)
    yield put(OrderActions.getOrderSuccess(order))

    if (actionSuccess) actionSuccess(order)
  } catch (error) {
    yield put(OrderActions.getOrderFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

function* updateOrderRequest({ orderID, params, originalOrder, actionSuccess }) {
  try {
    const { orderProductInfo, note, status } = params
    if (orderProductInfo.length === loGet(originalOrder, ['orderProductInfo', 'length'])) {
      let checkEqual = true
      const originalProducts = originalOrder.orderProductInfo
      for (let i = 0; i < originalProducts.length; i++) {
        const originalProduct = originalProducts[i]
        const indexProductData = orderProductInfo.findIndex(item => item.productID === loGet(originalProduct, ['product','id']))
        if (indexProductData < 0 
          || originalProduct.orderQuantity !== orderProductInfo[indexProductData].orderQuantity
          || originalProduct.orderRealPrice !== orderProductInfo[indexProductData].orderRealPrice) {
          checkEqual = false
          break
        }
      }
      if (checkEqual === true) delete params.orderProductInfo
    }

    if (note === originalOrder.note) delete params.note
    if (status === originalOrder.status) delete params.status

    const message = 'Success'
    if (Object.keys(params).length > 0) {
      yield call(api.updateOrder, orderID, params)
    }

    yield put(OrderActions.updateOrderSuccess())
    yield put(AppActions.showSuccessRequest(message))

    if (actionSuccess) actionSuccess()
    yield put(push('/orders'))
  } catch (error) {
    yield put(OrderActions.updateOrderFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

export default productRootSagas