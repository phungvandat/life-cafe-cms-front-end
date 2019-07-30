import { all, takeLatest, put, call, select } from 'redux-saga/effects'
import { removePhonePrefix } from '../../utils/helper'
import * as api from './customerFormApi'
import AppActions from '../../redux/appRedux'
import CustomerFormActions, { CustomerFormTypes } from './customerFormRedux'

function* customerFormRootSagas() {
  yield all([
    yield takeLatest(CustomerFormTypes.CUSTOMER_FORM_UPDATE_REQUEST, customerFormUpdateRequest),
  ])
}

function* customerFormUpdateRequest({ customerID, params, actionSuccess }) {
  try {
    const actionSuccessRedux = yield select(state => state.customerForm.get('actionSuccess'))

    const {
      phoneNumber,
      fullname,
      address,
      original,
    } = params

    const data = {
      fullname: fullname !== original.fullname ? fullname : undefined,
      phoneNumber: removePhonePrefix(phoneNumber) !== removePhonePrefix(original.phoneNumber) ? phoneNumber : undefined,
      address: address !== original.address ? address : undefined,
    }

    const { user } = yield call(api.updateCustomer, customerID, data)
    const customer = user

    yield put(CustomerFormActions.customerFormUpdateSuccess(customer))
    if (actionSuccess) {
      actionSuccess(customer)
    }
  
    if (actionSuccessRedux) actionSuccessRedux(customer)
  } catch (error) {
    yield put(AppActions.showErrorRequest(error))
    yield put(CustomerFormActions.customerFormUpdateFailure(error))
  }
}

export default customerFormRootSagas