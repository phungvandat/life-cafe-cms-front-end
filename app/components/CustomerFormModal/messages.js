/*
 * CustomerFormModal Messages
 *
 * This contains all the text for the CustomerFormModal component.
 */

import { defineMessages } from 'react-intl'

export const scope = 'app.components.CustomerFormModal'

export default defineMessages({
  // Title header
  customerInformation: {
    id: `${scope}.customerInformation`,
    defaultMessage: 'Customer information',
  },

  // Modal action button
  cancelText: {
    id: `${scope}.cancelText`,
    defaultMessage: 'Cancel',
  },
  okTextUpdate: {
    id: `${scope}.okTextUpdate`,
    defaultMessage: `Update`,
  },

  // Input label
  customerPhone: {
    id: `${scope}.customerPhone`,
    defaultMessage: 'Phone number',
  },
  customerName: {
    id: `${scope}.customerName`,
    defaultMessage: 'Customer name',
  },
  customerAddress: {
    id: `${scope}.customerAddress`,
    defaultMessage: 'Address',
  },

  // Placeholder
  fillCustomerPhone: {
    id: `${scope}.fillCustomerPhone`,
    defaultMessage: 'Fill customer phoneNumber',
  },
  fillCustomerFullname: {
    id: `${scope}.fillCustomerFullname`,
    defaultMessage: 'Fill customer fullname',
  },
  fillCustomerAddress: {
    id: `${scope}.fillCustomerAddress`,
    defaultMessage: 'Fill customer address',
  },

  // Validation message
  pleaseFillCustomerMobilePhone: {
    id: `${scope}.pleaseFillCustomerMobilePhone`,
    defaultMessage: 'Please fill customer mobile phone number',
  },
  pleaseFillCorrectTypeOfMobilePhone: {
    id: `${scope}.pleaseFillCorrectTypeOfMobilePhone`,
    defaultMessage: 'Please fill correct type of mobile phone number',
  },
  pleaseFillCustomerName: {
    id: `${scope}.pleaseFillCustomerName`,
    defaultMessage: 'Please fill customer name',
  },
})
