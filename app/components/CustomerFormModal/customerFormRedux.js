import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  customerFormUpdateRequest: ['customerID', 'params', 'actionSuccess'],
  customerFormUpdateSuccess: ['customer', 'conversationID'],
  customerFormUpdateFailure: ['error'],

  showCustomerFormModal: ['customer', 'conversationID', 'actionSuccess'],
  hideCustomerFormModal: null,
})

export const CustomerFormTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  isUpdating: false,
  isVisible: false,
  isGettingTreatmentPackages: false,

  customer: {},
  conversationID: '',
})

/* ------------- Reducers ------------- */

const customerFormUpdateRequest = (state) => (
  state.merge({ isUpdating: true })
)

const customerFormUpdateSuccess = (state, { customer }) => (
  state.merge({ 
    isUpdating: false,
    customer,
  })
)

const customerFormUpdateFailure = (state) => (
  state.merge({ isUpdating: false })
)

const showCustomerFormModal = (state, { customer, conversationID, actionSuccess }) => (
  state.merge({ 
    isVisible: true,
    customer,
    conversationID,
    actionSuccess,
  })
)

const hideCustomerFormModal = (state) => (
  state.merge({ isVisible: false })
)

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CUSTOMER_FORM_UPDATE_REQUEST]: customerFormUpdateRequest,
  [Types.CUSTOMER_FORM_UPDATE_SUCCESS]: customerFormUpdateSuccess,
  [Types.CUSTOMER_FORM_UPDATE_FAILURE]: customerFormUpdateFailure,

  [Types.SHOW_CUSTOMER_FORM_MODAL]: showCustomerFormModal,
  [Types.HIDE_CUSTOMER_FORM_MODAL]: hideCustomerFormModal,
})
