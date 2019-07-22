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
        text: 'NEW',
      },
      rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
    },
    {
      name: <FormattedMessage {...messages.Categories} />,
      url: '/categories',
      icon: 'fa fa-list-ul',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
      rolesAccess: [ROLES.ADMIN, ROLES.MASTER],
    },
  ],
}
