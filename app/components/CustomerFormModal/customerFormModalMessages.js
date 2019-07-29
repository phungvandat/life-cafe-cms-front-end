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
  titlesName: {
    id: `${scope}.titlesName`,
    defaultMessage: 'Titles name',
  },
  customerName: {
    id: `${scope}.customerName`,
    defaultMessage: 'Customer name',
  },
  birthday: {
    id: `${scope}.birthday`,
    defaultMessage: 'Birthday',
  },
  facebookUrl: {
    id: `${scope}.facebookUrl`,
    defaultMessage: 'Facebook URL',
  },
  facebookName: {
    id: `${scope}.facebookName`,
    defaultMessage: 'Facebook name',
  },
  customerEmail: {
    id: `${scope}.customerEmail`,
    defaultMessage: 'Email',
  },
  countries: {
    id: `${scope}.countries`,
    defaultMessage: 'Countries',
  },
  cities: {
    id: `${scope}.cities`,
    defaultMessage: 'Cities',
  },
  customerAddress: {
    id: `${scope}.customerAddress`,
    defaultMessage: 'Address',
  },
  customerSources: {
    id: `${scope}.customerSources`,
    defaultMessage: 'Customer Sources',
  },
  Note: {
    id: `${scope}.Note`,
    defaultMessage: 'Note',
  },

  // Placeholder
  selectCustomerSource: {
    id: `${scope}.selectCustomerSource`,
    defaultMessage: 'Select customer source',
  },
  fillCustomerPhone: {
    id: `${scope}.fillCustomerPhone`,
    defaultMessage: 'Fill customer phoneNumber',
  },
  fillCustomerFullname: {
    id: `${scope}.fillCustomerFullname`,
    defaultMessage: 'Fill customer fullname',
  },
  selectTitleName: {
    id: `${scope}.selectTitleName`,
    defaultMessage: 'Select customer title name',
  },
  specifyCustomerBirthday: {
    id: `${scope}.specifyCustomerBirthday`,
    defaultMessage: 'Specify customer birthday',
  },
  fillCustomerFacebookUrl: {
    id: `${scope}.fillCustomerFacebookUrl`,
    defaultMessage: 'Fill customer Facebook URL',
  },
  fillCustomerFacebookName: {
    id: `${scope}.fillCustomerFacebookName`,
    defaultMessage: 'Fill customer Facebook name',
  },
  fillCustomerEmail: {
    id: `${scope}.fillCustomerEmail`,
    defaultMessage: 'Fill customer Email',
  },
  selectCustomerCountry: {
    id: `${scope}.selectCustomerCountry`,
    defaultMessage: 'Select customer country',
  },
  selectCustomerCity: {
    id: `${scope}.selectCustomerCity`,
    defaultMessage: 'Select customer city',
  },
  fillCustomerAddress: {
    id: `${scope}.fillCustomerAddress`,
    defaultMessage: 'Fill customer address',
  },
  fillNote: {
    id: `${scope}.fillNote`,
    defaultMessage: 'Fill Note',
  },

  // Title names option
  ms: {
    id: `${scope}.ms`,
    defaultMessage: 'Ms',
  },
  mrs: {
    id: `${scope}.mrs`,
    defaultMessage: 'Mrs',
  },
  miss: {
    id: `${scope}.miss`,
    defaultMessage: 'Miss',
  },
  mr: {
    id: `${scope}.mr`,
    defaultMessage: 'Mr',
  },

  // Validation message
  pleaseFillCustomerMobilePhone: {
    id: `${scope}.pleaseFillCustomerMobilePhone`,
    defaultMessage: 'Please fill customer mobile phoneNumber',
  },
  pleaseFillCorrectTypeOfMobilePhone: {
    id: `${scope}.pleaseFillCorrectTypeOfMobilePhone`,
    defaultMessage: 'Please fill correct type of mobile phoneNumber',
  },
  pleaseFillCustomerName: {
    id: `${scope}.pleaseFillCustomerName`,
    defaultMessage: 'Please fill customer name',
  },
  pleaseFillCorrectTypeOfEmail: {
    id: `${scope}.pleaseFillCorrectTypeOfEmail`,
    defaultMessage: 'Please fill correct type of email',
  },
  pleaseSelectCustomerSource: {
    id: `${scope}.pleaseSelectCustomerSource`,
    defaultMessage: 'Please select customer source',
  },
  messenger: {
    id: `${scope}.messenger`,
    defaultMessage: 'Facebook messenger',
  },
  zaloMessenger: {
    id: `${scope}.zaloMessenger`,
    defaultMessage: 'Zalo messenger',
  },
  walkin: {
    id: `${scope}.walkin`,
    defaultMessage: 'Walk in',
  },
  weva: {
    id: `${scope}.weva`,
    defaultMessage: 'Weva App',
  },
})
