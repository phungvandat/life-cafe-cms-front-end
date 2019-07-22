import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './containers/DefaultLayout/messages'
import { ROLES } from './utils/constants'

const Dashboard = React.lazy(() => import('containers/Dashboard'))
const Categories = React.lazy(()=> import('containers/Categories'))

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
]

export default routes
