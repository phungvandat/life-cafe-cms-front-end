import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { compose } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import {
  Layout,
  Card,
} from 'antd'
import ReactTable from 'react-table'
import loGet from 'lodash/get'
import defaultLayoutMessages from 'containers/DefaultLayout/messages'

import saga from './customersSagas'
import CustomersActions, { reducer } from './customersRedux'
import messages from './messages'
import { ROLES } from '../../utils/constants'

class Customers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      skip: 0,
      limit: 50,
    }

    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.getCustomersRequest()
  }

  fetchData(state) {
    const { pageSize, page } = state
    this.setState({
      limit: pageSize,
      skip: page * pageSize,
    }, this.getCustomersRequest)
  }

  getCustomersRequest() {
    const { skip, limit } = this.state
    const { getCustomersRequest } = this.props
    getCustomersRequest({ skip, limit, role: ROLES.USER })
  }

  render() {
    const { intl, customers, total, isGettingCustomers } = this.props
    const { limit } = this.state

    const columns = [
      {
        Header: <FormattedMessage {...messages.No} />,
        id: "row",
                Cell: data => data.index + 1, // eslint-disable-line
        width: 60,
      },
      {
        Header: <FormattedMessage {...messages.Avatar} />,
        accessor: 'avatar',
        headerStyle: { textAlign: 'center' },
        style: { textAlign: 'center' },
        Cell: data => (
                    <img // eslint-disable-line
            className="img-avatar"
            src={loGet(data, ['row', 'avatar'])}
          >
          </img>
        ),
        width: 130,
      },
      {
        Header: <FormattedMessage {...messages.Fullname} />,
        accessor: 'fullname',
      },
      {
        Header: <FormattedMessage {...messages.PhoneNumber} />,
        accessor: 'phoneNumber',
      },
      {
        Header: <FormattedMessage {...messages.Address} />,
        accessor: 'address',
        width: 500,
      },
      {
        Header: <FormattedMessage {...messages.Role} />,
        accessor: 'role',
        width: 130,
      },
    ]

    return (
      <Layout >
        <Helmet>
          <title>{intl.formatMessage(messages.Title)}</title>
          <meta name="description" content={<FormattedMessage {...messages.Title} />} />
        </Helmet>
        <Layout.Content className="mt-4">
          <Card
            title={
              <div className="flex flex--stretch">
                <FormattedMessage {...messages.Title} />
              </div>
            }
            bordered={false}
            bodyStyle={{ padding: 0 }}
          >
            <ReactTable
              columns={columns}
              showPageSizeOptions
              sortable={false}
              defaultPageSize={limit}
              manual
              className="-highlight"
              data={customers}
              pages={Math.ceil(total / limit)}
              loading={isGettingCustomers}
              onFetchData={this.fetchData}
              onPageSizeChange={pageSize => this.setState({ limit: pageSize })}
              style={{ border: 0 }}
              noDataText={
                !isGettingCustomers
                  ? intl.formatMessage(defaultLayoutMessages.noDataText)
                  : null
              }
              loadingText={intl.formatMessage(defaultLayoutMessages.loadingText)}
              previousText={intl.formatMessage(defaultLayoutMessages.previousText)}
              nextText={intl.formatMessage(defaultLayoutMessages.nextText)}
              pageText={intl.formatMessage(defaultLayoutMessages.pageText)}
              ofText={intl.formatMessage(defaultLayoutMessages.ofText)}
              rowsText={intl.formatMessage(defaultLayoutMessages.rowsText)}
            />
          </Card>

        </Layout.Content>
      </Layout>
    )
  }
}

Customers.propTypes = {
  customers: PropTypes.array,
  getCustomersRequest: PropTypes.func,
  isGettingCustomers: PropTypes.bool,
  total: PropTypes.number,
}

const withReducer = injectReducer({ key: 'customers', reducer })
const withSaga = injectSaga({ key: 'customers', saga })

const mapStateToProps = state => {
  const customers = state.customers ? state.customers.toJS() : {}
  return {
    customers: customers.customers || [],
    isGettingCustomers: customers.isGettingCustomers,
    total: customers.total,
  }
}

const mapDispatchToProps = dispatch => ({
  getCustomersRequest: (params, actionSuccess) =>
    dispatch(CustomersActions.getCustomersRequest(params, actionSuccess)),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(Customers))