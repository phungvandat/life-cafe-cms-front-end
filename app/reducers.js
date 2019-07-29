import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { reducer as notifications } from 'react-notification-system-redux'
import history from './utils/history'

/*
  - Function create root reducer work with immutable state
  - Pass reducers to param
*/

function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    notifications,
    language: require('./containers/LanguageProvider/languageRedux').reducer, // eslint-disable-line
    customerForm: require('./components/CustomerFormModal/customerFormRedux').reducer, // eslint-disable-line
    user: require('./redux/userRedux').reducer, // eslint-disable-line
    app: require('./redux/appRedux').reducer, // eslint-disable-line
    ...injectedReducers,
  })
  const mergeWithRouterState = connectRouter(history)
  return mergeWithRouterState(rootReducer)
}

export default createReducer
