const app = require('./app.json')
const categories = require('./categories.json')
const customerFormModal = require('./customerFormModal.json')
const dashboard = require('./dashboard.json')
const defaultLayout = require('./defaultLayout.json')
const itemsModal = require('./itemsModal.json')
const order = require('./order.json')
const orders = require('./orders.json')
const product = require('./product.json')
const products = require('./products.json')
const customers = require('./customers.json')

export const viTranslationMessages = {
  ...app,
  ...categories,
  ...customerFormModal,
  ...dashboard,
  ...defaultLayout,
  ...itemsModal,
  ...order,
  ...orders,
  ...product,
  ...products,
  ...customers,
}
