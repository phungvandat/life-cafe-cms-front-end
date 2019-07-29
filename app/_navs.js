import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ROLES } from './utils/constants'
import messages from './containers/DefaultLayout/messages'

export default {
  items: [
    {
      name: <FormattedMessage {...messages.Dashboard} />,
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
      },
      rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
    },
    {
      name: <FormattedMessage {...messages.Categories} />,
      url: '/categories',
      icon: 'fa fa-list-ul',
      badge: {
        variant: 'info',
      },
      rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
    },
    {
      name: <FormattedMessage {...messages.Products} />,
      url: '/products',
      icon: 'fa fa-shopping-cart',
      badge: {
        variant: 'info',
      },
      rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
    },
    {
      name: <FormattedMessage {...messages.Orders} />,
      url: '/orders',
      icon: 'fa fa-shopping-bag',
      badge: {
        variant: 'info',
      },
      rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
    },
    {
      name: <FormattedMessage {...messages.Customers} />,
      url: '/customers',
      icon: 'fa fa-address-card',
      badge: {
        variant: 'info',
      },
      rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
    },
  ],
}
