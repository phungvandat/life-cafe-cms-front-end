import { 
  takeLatest,
  all,
  call,
  put,
} from "redux-saga/effects"
import CustomersActions, {CustomersTypes} from './customersRedux'
import AppActions from '../../redux/appRedux'
import * as api from './customersApi'

function* customersRootSagas(){
  yield all([
    yield takeLatest(CustomersTypes.GET_CUSTOMERS_REQUEST,
      getCustomersRequest),
  ])
}

function* getCustomersRequest({params,actionSuccess}){
  try{
    const {users, total} = yield call(api.getCustomers, params)
    yield put(CustomersActions.getCustomersSuccess(users,total))
    if (actionSuccess) actionSuccess()
  }catch(error){
    yield put(CustomersActions.getCustomersFailure(error))
    yield put(AppActions.showErrorRequest(error))
  }
}

export default customersRootSagas