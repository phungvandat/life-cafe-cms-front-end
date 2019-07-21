/* eslint-disable */

import { AppSidebarNav } from '@coreui/react'
import react from 'react'
import {
  NavItem,
  NavLink,
} from 'reactstrap'
const _reactRouterDom = require('react-router-dom')

const _extends = Object.assign ||
  function (target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i]
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

const interopRequireDefault = obj =>
  obj && obj.__esModule ? obj : { default: obj }

const react2 = interopRequireDefault(react)

AppSidebarNav.prototype.navLink = function navLink(item, key, classes) {
  const { disabled, warning } = this.props
  const url = item.url ? item.url : ''
  const itemIcon = react2.default.createElement('i', { className: classes.icon })
  const itemBadge = this.navBadge(item.badge)
  const attributes = item.attributes || {}
  return react2.default.createElement(
    NavItem,
    { key: key, className: classes.item },
    attributes.disabled ? react2.default.createElement(
      NavLink,
      _extends({ href: "", className: classes.link }, attributes),
      itemIcon,
      item.name,
      itemBadge
    ) : this.isExternal(url) ? react2.default.createElement(
      NavLink,
      _extends({ href: url, className: classes.link, active: true }, attributes),
      itemIcon,
      item.name,
      itemBadge
    ) : react2.default.createElement(
      _reactRouterDom.NavLink,
      _extends({
        to: disabled ? '/dashboard' : url,
        className: classes.link,
        activeClassName: disabled ? '' : 'active',
        onClick: disabled ? warning : this.hideMobile
      }, attributes),
      itemIcon,
      item.name,
      itemBadge
    )
  )
}

AppSidebarNav.prototype.navList = function navList(items) {
  const _this2 = this
  const { user } = this.props
  return items.map(function (item, index) {
    if (item.rolesAccess && item.rolesAccess.includes(user.role)) {
      return _this2.navType(item, index);
    }
  })
}