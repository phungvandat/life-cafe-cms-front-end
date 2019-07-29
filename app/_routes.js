import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './containers/DefaultLayout/messages'
import { ROLES } from './utils/constants'

const Dashboard = React.lazy(() => import('./containers/Dashboard'))
const Categories = React.lazy(()=> import('./containers/Categories'))
const Products = React.lazy(() => import('./containers/Products'))
const Product = React.lazy(() => import('./containers/Product'))
const Orders = React.lazy(()=>import('./containers/Orders'))
const Order = React.lazy(()=>import('./containers/Order'))

const routes = [
  {
    path: '/dashboard',
    name: (<FormattedMessage {...messages.Dashboard} />),
    component: Dashboard,
    rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
  },
  {
    path: '/categories',
    name: (<FormattedMessage {...messages.Categories} />),
    component: Categories,
    rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
  },
  {
    path: '/products',
    name: (<FormattedMessage {...messages.Products} />),
    component: Products,
    exact: true,
    rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
  },
  {
    path: '/products/create',
    name: (<FormattedMessage {...messages.CreateProduct} />),
    component: Product,
    exact: true,
    rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
  },
  {
    path: '/products/:productID',
    name: (<FormattedMessage {...messages.UpdateProduct} />),
    component: Product,
    rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
  },
  {
    path: '/orders',
    name: (<FormattedMessage {...messages.Orders}/>),
    component: Orders,
    exact: true,
    rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
  },
  {
    path: '/orders/create',
    name: (<FormattedMessage {...messages.CreateOrder}/>),
    component: Order,
    exact: true,
    rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
  },
  {
    path: '/orders/:orderID',
    name: (<FormattedMessage {...messages.OrderDetail}/>),
    component: Order,
    exact: true,
    rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
  },
]

export default routes
