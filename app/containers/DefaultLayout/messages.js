/*
 * DefaultLayout Messages
 *
 * This contains all the text for the DefaultLayout container.
 */

import { defineMessages } from 'react-intl'

export const scope = 'app.containers.DefaultLayout'

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the DefaultLayout container!',
  },
  Dashboard: {
    id: `${scope}.Dashboard`,
    defaultMessage: 'Dashboard',
  },
  SupportedLanguages: {
    id: `${scope}.SupportedLanguages`,
    defaultMessage: 'Supported Languages',
  },
  Account: {
    id: `${scope}.Account`,
    defaultMessage: 'Account',
  },
  logout: {
    id: `${scope}.logout`,
    defaultMessage: 'Logout',
  },
  vietnamese: {
    id: `${scope}.vietnamese`,
    defaultMessage: 'Tiếng Việt',
  },
  english: {
    id: `${scope}.english`,
    defaultMessage: 'English',
  },

  // React table
  noDataText: {
    id: `${scope}.noDataText`,
    defaultMessage: 'No data',
  },
  loadingText: {
    id: `${scope}.loadingText`,
    defaultMessage: 'Loading',
  },
  previousText: {
    id: `${scope}.previousText`,
    defaultMessage: 'Previous',
  },
  nextText: {
    id: `${scope}.nextText`,
    defaultMessage: 'Next',
  },
  pageText: {
    id: `${scope}.pageText`,
    defaultMessage: 'Page',
  },
  ofText: {
    id: `${scope}.ofText`,
    defaultMessage: 'of',
  },
  rowsText: {
    id: `${scope}.rowsText`,
    defaultMessage: 'rows',
  },

  YouHave: {
    id: `${scope}.YouHave`,
    defaultMessage: 'You have ',
  },
  Messages: {
    id: `${scope}.Messages`,
    defaultMessage: ' messages',
  },
  Products: {
    id: `${scope}.Products`,
    defaultMessage: 'Products',
  },
  Categories: {
    id: `${scope}.Categories`,
    defaultMessage: 'Categories',
  },
  Orders: {
    id: `${scope}.Orders`,
    defaultMessage: 'Orders',
  },
  CreateProduct: {
    id: `${scope}.CreateProduct`,
    defaultMessage: 'Create product',
  },
  UpdateProduct: {
    id: `${scope}.UpdateProduct`,
    defaultMessage: 'Update product',
  },
  CreateOrder: {
    id: `${scope}.CreateOrder`,
    defaultMessage: 'Create order',
  },
  OrderDetail: {
    id: `${scope}.OrderDetail`,
    defaultMessage: 'Order detail',
  },
  Customers: {
    id: `${scope}.Customers`,
    defaultMessage: 'Customers',
  },
})
