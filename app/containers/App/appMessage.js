import { defineMessages } from 'react-intl'

export const scope = 'app.containers.App'

export default defineMessages({
  warningTitle: {
    id: `${scope}.warningTitle`,
    defaultMessage: 'Warning',
  },
  warningContent: {
    id: `${scope}.warningContent`,
    defaultMessage: 'Life Cafe CMS',
  },
})