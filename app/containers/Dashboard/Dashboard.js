/* eslint-disable object-curly-newline */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { injectIntl } from 'react-intl'
import { compose } from 'redux'
import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import PropTypes from 'prop-types'
import { reducer } from './dashboardRedux'
import saga from './dashboardSagas'

import messages from './messages'

export class Dashboard extends Component { // eslint-disable-line
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { intl } = this.props
    return (
      <div style={{ marginTop: '20px' }}>
        <Helmet>
          <title>
            {intl.formatMessage(messages.title)}
          </title>
          <meta name="description" content="Description of Dashboard" />
        </Helmet>
      </div>
    )
  }
}

Dashboard.propTypes = {
  intl: PropTypes.object,
}

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => ({})

// eslint-disable-next-line no-unused-vars
function mapDispatchToProps(dispatch) {
  return {}
}

const withReducer = injectReducer({ key: 'dashboard', reducer })
const withSaga = injectSaga({ key: 'dashboard', saga })

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(Dashboard))
