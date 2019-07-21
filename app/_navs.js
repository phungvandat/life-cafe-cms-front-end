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
      rolesAccess: [ROLES.CLINIC_ADMIN, ROLES.MODERATOR, ROLES.CONSULTANT, ROLES.TECHNICIAN],
    },
  ],
}
