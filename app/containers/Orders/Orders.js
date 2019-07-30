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
  Button,
  Tooltip,
  Tag,
  Typography,
} from 'antd'
import { Link } from 'react-router-dom'
import ReactTable from 'react-table'
import loGet from 'lodash/get'
import moment from 'moment'
import defaultLayoutMessages from 'containers/DefaultLayout/messages'

import saga from './ordersSagas'
import OrdersActions, { reducer } from './ordersRedux'
import AppActions from '../../redux/appRedux'
import messages from './messages'
import { isDark } from '../../utils/helper'
import { ORDER_STATUS } from '../../utils/constants'

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      skip: 0,
      limit: 50,
    }

    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    this.getOrdersRequest()
  }

  fetchData(state) {
    const { pageSize, page } = state
    this.setState({
      limit: pageSize,
      skip: page * pageSize,
    }, this.getOrdersRequest)
  }

  getOrdersRequest() {
    const { skip, limit } = this.state
    const { getOrdersRequest } = this.props
    getOrdersRequest({ skip, limit })
  }

  render() {
    const { intl, orders, total, isGettingOrders } = this.props
    const { limit } = this.state

    const columns = [
      {
        Header: <FormattedMessage {...messages.No} />,
        id: "row",
        Cell: data => data.index + 1, // eslint-disable-line
        width: 60,
      },
      {
        Header: <FormattedMessage {...messages.Type} />,
        accessor: 'type',
        width: 150,
        Cell: row => <React.Fragment>{messages[row.value] ? intl.formatMessage(messages[row.value]) : row.value}</React.Fragment>,
      },
      {
        Header: <FormattedMessage {...messages.CreatedAt} />,
        accessor: 'createdAt',
        headerStyle: { textAlign: 'center' },
        style: { textAlign: 'center' },
        Cell: row => <React.Fragment>{moment(row.value).format('DD/MM/YYYY')}</React.Fragment>,
        width: 200,
      },
      {
        Header: <FormattedMessage {...messages.Status} />,
        accessor: 'status',
        width: 150,
        Cell: row => <React.Fragment>{messages[row.value] ? intl.formatMessage(messages[row.value]) : row.value}</React.Fragment>,
      },
      {
        Header: <FormattedMessage {...messages.DoneDate} />,
        accessor: 'updatedAt',
        headerStyle: { textAlign: 'center' },
        style: { textAlign: 'center' },
        Cell: row => <React.Fragment>
          {
            loGet(row, ['original', 'status']) === ORDER_STATUS.DONE ?
              moment(row.value).format('DD/MM/YYYY') : ''
          }
        </React.Fragment>,
        width: 200,
      },
      {
        Header: <FormattedMessage {...messages.Products} />,
        accessor: 'orderProductInfo',
        Cell: row => <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >{row.value.map(item => {
            const product = item.product || {}
            return (
              <div key={product.id}>
                <Tag color={product.color}>
                  <Typography.Text
                    style={{
                      color: isDark(product.color) ? 'white' : 'black',
                    }}
                    strong
                  >
                    {product.name}
                  </Typography.Text>
                </Tag>
              </div>
            )
          })}</div>,
      },
      {
        Header: <FormattedMessage {...messages.Actions} />,
        accessor: 'id',
        Cell: row =>
          <React.Fragment>
            <Link to={`orders/${row.value}`}>
              <Tooltip
                title={<FormattedMessage {...messages.Detail} />}
              >
                <Button
                  type="primary"
                  icon="file-search"
                  className="mr-1 ml-1"
                />
              </Tooltip>
            </Link>
          </React.Fragment>,
        width: 150,
      },
    ]

    return (
      <Layout >
        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name="description" content={<FormattedMessage {...messages.title} />} />
        </Helmet>
        <Layout.Content className="mt-4">
          <Card
            title={
              <div className="flex flex--stretch">
                <FormattedMessage {...messages.Orders} />
                <Link to="/orders/create">
                  <Button
                    style={{ fontWeight: 'bold' }}
                    type="primary"
                    ghost
                  >
                    <FormattedMessage {...messages.Create} />
                  </Button>
                </Link>
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
              data={orders}
              pages={Math.ceil(total / limit)}
              loading={isGettingOrders}
              onFetchData={this.fetchData}
              onPageSizeChange={pageSize => this.setState({ limit: pageSize })}
              style={{ border: 0 }}
              noDataText={
                !isGettingOrders
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

Orders.propTypes = {
  orders: PropTypes.array,
  getOrdersRequest: PropTypes.func,
  isGettingOrders: PropTypes.bool,
  total: PropTypes.number,
}

const withReducer = injectReducer({ key: 'orders', reducer })
const withSaga = injectSaga({ key: 'orders', saga })

const mapStateToProps = state => {
  const orders = state.orders ? state.orders.toJS() : {}
  return {
    orders: orders.orders || [],
    isGettingOrders: orders.isGettingOrders,
    total: orders.total,
  }
}

const mapDispatchToProps = dispatch => ({
  getOrdersRequest: (params, actionSuccess) =>
    dispatch(OrdersActions.getOrdersRequest(params, actionSuccess)),
  confirm: (title, content, okText, cancelText, actionSuccess, actionFailure) =>
    dispatch(AppActions.confirm(title, content, okText, cancelText, actionSuccess, actionFailure)),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(Orders))