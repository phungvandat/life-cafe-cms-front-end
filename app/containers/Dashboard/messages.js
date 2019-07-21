/*
 * Dashboard Messages
 *
 * This contains all the text for the Dashboard container.
 */

import { defineMessages } from 'react-intl'

export const scope = 'app.containers.Dashboard'

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Dashboard container!',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Dashboard',
  },
  shortcut: {
    id: `${scope}.shortcut`,
    defaultMessage: 'Shortcut:',
  },
  totalEarnings: {
    id: `${scope}.totalEarnings`,
    defaultMessage: 'Total earnings',
  },
  totalMembers: {
    id: `${scope}.totalMembers`,
    defaultMessage: 'Total members',
  },
  totalBranches: {
    id: `${scope}.totalBranches`,
    defaultMessage: 'Total branches',
  },
  members: {
    id: `${scope}.members`,
    defaultMessage: 'Members',
  },
  branches: {
    id: `${scope}.branches`,
    defaultMessage: 'Branches',
  },
  currentWeek: {
    id: `${scope}.currentWeek`,
    defaultMessage: 'Current week',
  },
  oneWeekAgo: {
    id: `${scope}.oneWeekAgo`,
    defaultMessage: '1 week ago',
  },
  twoWeeksAgo: {
    id: `${scope}.twoWeeksAgo`,
    defaultMessage: '2 week ago',
  },
  threeWeeksAgo: {
    id: `${scope}.threeWeeksAgo`,
    defaultMessage: '3 week ago',
  },
  fourWeeksAgo: {
    id: `${scope}.fourWeeksAgo`,
    defaultMessage: '4 week ago',
  },
  increaseMonthOverMonth: {
    id: `${scope}.increaseMonthOverMonth`,
    defaultMessage: 'Increase Month Over Month',
  },
  amountOfMoneyInMonth: {
    id: `${scope}.amountOfMoneyInMonth`,
    defaultMessage: 'Amount of Money In Month',
  },
  earningOfBranch: {
    id: `${scope}.earningOfBranch`,
    defaultMessage: 'Earning of each Branch',
  },
  categoriesOfBooking: {
    id: `${scope}.categoriesOfBooking`,
    defaultMessage: 'Categories of booking',
  },
})
