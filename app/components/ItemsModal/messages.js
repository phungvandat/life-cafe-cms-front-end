import { defineMessages } from 'react-intl'

export const scope = 'app.components.ItemsModal'

export default defineMessages({
  CancelText: {
    id: `${scope}.CancelText`,
    defaultMessage: 'Cancel',
  },
  OkText: {
    id: `${scope}.OkText`,
    defaultMessage: 'Apply',
  },
  Price: {
    id: `${scope}.Price`,
    defaultMessage: 'Price',
  },
  Quantity: {
    id: `${scope}.Quantity`,
    defaultMessage: 'Quantity',
  },
  OrderQuantity: {
    id: `${scope}.OrderQuantity`,
    defaultMessage: 'Order quantity',
  },
  CannotSelectProductByOutOfStock: {
    id: `${scope}.CannotSelectProductByOutOfStock`,
    defaultMessage: 'Cannot select product by out of stock',
  },
  PleaseSelectProductFirst: {
    id: `${scope}.PleaseSelectProductFirst`,
    defaultMessage: 'Please select the product first',
  },
  OrderRealPrice: {
    id: `${scope}.OrderRealPrice`,
    defaultMessage: 'Order real price',
  },
})