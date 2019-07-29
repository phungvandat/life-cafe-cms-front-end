import { all } from 'redux-saga/effects'
import userRootSagas from './userSagas'
import appRootSagas from './appSagas'
import customerFormSagas from '../components/CustomerFormModal/customerFormSaga'

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    userRootSagas(),
    appRootSagas(),
    customerFormSagas(),
  ])
}
