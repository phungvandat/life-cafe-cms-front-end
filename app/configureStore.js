import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import { routerMiddleware } from 'connected-react-router/immutable'
import createSagaMiddleware from 'redux-saga'

import createReducer from './reducers'
import persistConfig from './configures/ReduxPersist'
import rootSagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(initialState = {}, history) {
  /*
    Create the store with two middlewares
    1. sagaMiddleware: Makes redux-sagas work
    2. routerMiddleware: Syncs the location/URL path to the state
  */
  const middlewares = [sagaMiddleware, routerMiddleware(history)]

  const enhancers = [applyMiddleware(...middlewares)]

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle, indent */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) // eslint-disable-line no-undef
      : compose

  // Create reducer with redux-persist
  const persistedReducer = persistReducer(persistConfig, createReducer())

  // Create store
  const store = createStore(
    persistedReducer,
    initialState,
    composeEnhancers(...enhancers),
  )
  // Create persistor
  const persistor = persistStore(store)

  // Extensions
  store.runSaga = sagaMiddleware.run
  store.injectedReducers = {} // Reducer registry
  store.injectedSagas = {} // Saga registry

  sagaMiddleware.run(rootSagas)

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(
        persistReducer(persistConfig, createReducer(store.injectedReducers)),
      )
    })
  }

  return { store, persistor }
}
