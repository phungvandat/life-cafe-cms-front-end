/*
 *
 * LanguageProvider reducer
 *
 */

import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

import { DEFAULT_LOCALE } from '../../i18n'; // eslint-disable-line

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  changeLocale: ['locale'],
})

export const LanguageTypes = Types
export default Creators

/* ------------- Initial State ------------- */

const INITIAL_STATE = fromJS({
  locale: DEFAULT_LOCALE,
})

/* ------------- Reducers ------------- */

const changeLocale = (state, { locale }) => (
  state.merge({ locale })
)

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_LOCALE]: changeLocale,
})
