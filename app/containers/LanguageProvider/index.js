/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { IntlProvider } from 'react-intl'
import moment from 'moment'
import './moment_vi'

import { makeSelectLocale } from './selectors'

export class LanguageProvider extends React.PureComponent {

  componentDidMount() {
    if (this.props.locale) {
      moment.locale(this.props.locale)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.locale !== prevProps.locale) {
      moment.locale(this.props.locale)
    }
  }

  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={this.props.messages[this.props.locale]}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    )
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired,
}

const mapStateToProps = createSelector(makeSelectLocale(), locale => ({
  locale,
}))

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LanguageProvider)
