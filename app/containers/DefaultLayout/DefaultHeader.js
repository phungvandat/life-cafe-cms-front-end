import React, { Component } from 'react'
import { DropdownMenu, DropdownToggle, Nav, DropdownItem } from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  AppHeaderDropdown,
  AppNavbarBrand,
  AppSidebarToggler,
} from '@coreui/react'

import { Icon } from 'antd'
import { connect } from 'react-redux'
import { VIETNAMESE_CODE, ENGLISH_CODE } from 'utils/constants'
import { get } from 'lodash'
import LanguageActions from '../LanguageProvider/languageRedux'
import usIcon from '../../images/icons/us.png'
import vnIcon from '../../images/icons/vn.png'
import messages from './messages'

import UserActions from '../../redux/userRedux'

import logo from '../../images/brand/logo.png'
import sygnet from '../../images/brand/sygnet.png'

import './DefaultHeader.scss'

const defaultProps = {}

/* eslint-disable react/prefer-stateless-function */
class DefaultHeader extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props)
  }


  render() {
    const {
      changeLocale,
      locale,
      signOut,
      user,
    } = this.props

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          className="main-brand"
          full={{ src: logo, width: 150, height: 30, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto branch" navbar style={{ padding: '0 30px' }}>
          <AppHeaderDropdown>
            <DropdownToggle nav className="flex flex--left">
              {
                get(user, ['avatar'], '') ?
                  <img
                    src={get(user, ['avatar'], '')}
                    className="img-avatar"
                    alt="admin@bootstrapmaster.com"
                  />
                  : <Icon
                    className="no-avatar"
                    type="user"
                  />
              }
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center">
                <strong><FormattedMessage {...messages.Account} /></strong>
              </DropdownItem>
              <DropdownItem onClick={signOut}>
                <i style={{ fontSize: 16 }} className="fa fa-sign-out text-secondary" />
                <FormattedMessage {...messages.logout} />
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>

          <AppHeaderDropdown>
            <DropdownToggle nav className="flex flex--center">
              {locale === VIETNAMESE_CODE ? (
                <img src={vnIcon} alt={VIETNAMESE_CODE} />
              )
                : (
                  <img src={usIcon} alt={ENGLISH_CODE} />
                )}
            </DropdownToggle>
            <DropdownMenu right className="dropdown-menu">
              <DropdownItem header tag="div" className="text-center">
                <strong><FormattedMessage {...messages.SupportedLanguages} /></strong>
              </DropdownItem>
              <DropdownItem onClick={() => changeLocale(VIETNAMESE_CODE)}>
                <FormattedMessage {...messages.vietnamese} />
              </DropdownItem>
              <DropdownItem onClick={() => changeLocale(ENGLISH_CODE)}>
                <FormattedMessage {...messages.english} />
              </DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    )
  }
}

DefaultHeader.propTypes = {
  signOut: PropTypes.func,
  dispatch: PropTypes.func,
  children: PropTypes.node,
  warning: PropTypes.func,
  user: PropTypes.object,
}
DefaultHeader.defaultProps = defaultProps

const mapStateToProps = state => (
  {
    locale: state.language.get('locale'),
    user: state.user.get('user').toJS(),
  }
)

const mapDispatchToProps = dispatch => ({
  dispatch,
  signOut: () => dispatch(UserActions.signOut()),
  changeLocale: locale => dispatch(LanguageActions.changeLocale(locale)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DefaultHeader)
