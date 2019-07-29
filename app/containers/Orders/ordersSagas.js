import {
  takeLatest,
  all,
  call,
  put,
} from 'redux-saga/effects'
import OrdersActions, { OrdersTypes } from './ordersRedux'
import AppActions from '../../redux/appRedux'
import * as api from './ordersApi'

function* ordersRootSagas() {
  yield all([
    yield takeLatest(OrdersTypes.GET_ORDERS_REQUEST,
      getOrdersRequest),
  ])

}

function* getOrdersRequest({ params, actionSuccess }) {
  try {
    const { orders, total } = yield call(api.getOrders, params)
    yield put(OrdersActions.getOrdersSuccess(orders, total))
    if (actionSuccess) actionSuccess()
  } catch (error) {
    yield put(OrdersActions.getOrdersFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

export default ordersRootSagas