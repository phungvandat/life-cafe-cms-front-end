import { takeLatest, all, call, put } from 'redux-saga/effects'
import { replace } from 'react-router-redux'
import UserActions, { UserTypes } from '../redux/userRedux'
import AppActions from '../redux/appRedux'
import userAPI from '../services/userAPI'
import { setToken } from '../configures/axios'

export default function* userRootSagas() {
  yield all([
    yield takeLatest(UserTypes.SIGN_IN, signIn),
    yield takeLatest(UserTypes.SIGN_OUT, signOut),
  ])
}

function* signIn({ params }) {
  try {
    const { user } = yield call(userAPI.signIn, params)
    yield put(UserActions.signInSuccess(user))
    setToken(user.token)
    yield put(AppActions.showSuccessRequest(`Welcome ${user.fullname}`))
    yield put(replace('/'))
  } catch (error) {
    yield put(UserActions.signInFailure(error))
    yield put(AppActions.showErrorRequest(error))
    setToken('')
  }
}

export function* signOut() {
  try {
    setToken('')
    yield put(replace('/signin'))
  } catch (error) {
    yield put(AppActions.showErrorRequest(error))
  }
}