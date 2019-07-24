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
import numeral from 'numeral'
import loGet from 'lodash/get'
import defaultLayoutMessages from 'containers/DefaultLayout/messages'

import saga from './productsSagas'
import ProductsActions, { reducer } from './productsRedux'
import AppActions from '../../redux/appRedux'
import messages from './messages'
import { isDark } from '../../utils/helper'

class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {
      skip: 0,
      limit: 50,
    }

    this.fetchData = this.fetchData.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    this.getProductsRequest()
  }

  fetchData(state) {
    const { pageSize, page } = state
    this.setState({
      limit: pageSize,
      skip: page * pageSize,
    }, this.getProductsRequest)
  }

  getProductsRequest() {
    const { skip, limit } = this.state
    const { getProductsRequest } = this.props
    getProductsRequest({ skip, limit })
  }

  handleDelete = (productID, index) => {
    const { confirm, intl, deleteProductRequest } = this.props
    confirm(
      intl.formatMessage(messages.ConfirmTitle),
      intl.formatMessage(messages.ConfirmContent),
      intl.formatMessage(messages.OkText),
      intl.formatMessage(messages.CancelText),
      () => deleteProductRequest(productID, index),
    )
  }

  render() {
    const { intl, products, total, isGettingProducts } = this.props
    const { limit } = this.state

    const columns = [
      {
        Header: <FormattedMessage {...messages.No} />,
        id: "row",
        Cell: data => data.index + 1, // eslint-disable-line
        width: 60,
      },
      {
        Header: <FormattedMessage {...messages.Photo} />,
        accessor: 'mainPhoto',
        headerStyle: { textAlign: 'center' },
        style: { textAlign: 'center' },
        Cell: data => (
          <img // eslint-disable-line
            className="img-avatar"
            src={loGet(data, ['row', 'mainPhoto'])}
          >
          </img>
        ),
        width: 130,
      },
      {
        Header: <FormattedMessage {...messages.Name} />,
        accessor: 'name',
      },
      {
        Header: <FormattedMessage {...messages.Price} />,
        accessor: 'price',
        Cell: row => `${numeral(row.value).format('0,0')} VND`,
      },
      {
        Header: <FormattedMessage {...messages.Categories} />,
        accessor: 'categories',
        Cell: row => <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >{row.value.map(item => (
            <div key={item.id}>
              <Tag color={item.color}>
                <Typography.Text
                  style={{
                    color: isDark(item.color) ? 'white' : 'black',
                  }}
                  strong
                >
                  {item.name}
                </Typography.Text>
              </Tag>
            </div>
          ))
          }</div>,
      },
      {
        Header: <FormattedMessage {...messages.Quantity} />,
        accessor: 'quantity',
      },
      {
        Header: <FormattedMessage {...messages.Action} />,
        accessor: 'id',
        Cell: row =>
          <React.Fragment>
            <Link to={`products/${row.value}`}>
              <Tooltip
                title={<FormattedMessage {...messages.Update} />}
              >
                <Button
                  type="primary"
                  icon="edit"
                  className="mr-1 ml-1"
                />
              </Tooltip>
            </Link>
            {/* <Tooltip
              title={<FormattedMessage {...messages.Delete} />}
            >
              <Button
                icon="delete"
                className="mr-1 ml-1 bg-danger"
                style={{
                  borderColor: '#f86c6b',
                  color: 'white',
                }}
                onClick={() => this.handleDelete(row.value, row.index)}
              />
            </Tooltip> */}

          </React.Fragment>,
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
                <FormattedMessage {...messages.Products} />
                <Link to="/products/create">
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
              data={products}
              pages={Math.ceil(total / limit)}
              loading={isGettingProducts}
              onFetchData={this.fetchData}
              onPageSizeChange={pageSize => this.setState({ limit: pageSize })}
              style={{ border: 0 }}
              noDataText={
                !isGettingProducts
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

Products.propTypes = {
  products: PropTypes.array,
  getProductsRequest: PropTypes.func,
  isGettingProducts: PropTypes.bool,
  total: PropTypes.number,
  deleteProductRequest: PropTypes.func,
}

const withReducer = injectReducer({ key: 'products', reducer })
const withSaga = injectSaga({ key: 'products', saga })

const mapStateToProps = state => {
  const products = state.products ? state.products.toJS() : {}
  return {
    products: products.products || [],
    isGettingProducts: products.isGettingProducts,
    total: products.total,
  }
}

const mapDispatchToProps = dispatch => ({
  getProductsRequest: (params, actionSuccess) =>
    dispatch(ProductsActions.getProductsRequest(params, actionSuccess)),
  confirm: (title, content, okText, cancelText, actionSuccess, actionFailure) =>
    dispatch(AppActions.confirm(title, content, okText, cancelText, actionSuccess, actionFailure)),
  deleteProductRequest: (productID, index) =>
    dispatch(ProductsActions.deleteProductRequest(productID, index)),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(Products))