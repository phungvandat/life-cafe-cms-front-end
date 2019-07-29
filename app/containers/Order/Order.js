import { FormattedMessage, injectIntl } from 'react-intl'
import queryString from 'querystring'
import numeral from 'numeral'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import loGet from 'lodash/get'
import loDebounce from 'lodash/debounce'
import moment from 'moment'
import ReactTable from 'react-table'
import {
  Row,
  Col,
  Input,
  Select,
  Icon,
  Button,
  Form,
  Card,
  Layout,
  Avatar,
  Typography,
  Tooltip,
  Checkbox,
} from 'antd'
import { compose } from 'redux'
import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import CustomerFormModal from 'components/CustomerFormModal'
import CustomerFormActions from 'components/CustomerFormModal/customerFormRedux'
import R from 'ramda'

import AppActions from '../../redux/appRedux'
import OrderActions, { reducer } from './orderRedux'
import saga from './orderSaga'
import messages from './messages'
import CustomerPhoneSelect from '../../components/CustomerPhoneSelect'
import ItemsModal from '../../components/ItemsModal'
import {
  ORDER_TYPES,
  ORDER_STATUS,
} from '../../utils/constants'
import { userValidation } from '../../utils/helper'
import './order.scss'

const INITIAL_STATE = {
  type: undefined,
  note: '',
  orderID: '',
  phoneNumber: '',
  fullname: '',
  address: '',
  customerID: '',
  productID: '',
  customer: {},
  visible: false,
  productsData: [],
  error: {
    customer: {},
    receiver: {},
  },
  isEditable: true,
  productsSelected: [],
  status: undefined,
  originalOrder: {},
  implementer: {},
  receiverPhoneNumber: '',
  receiverFullname: '',
  receiverAddress: '',
  isSelectAsReceiverPhoneNumber: false,
  isSelectAsReceiverFullname: false,
  isSelectAsReceiverAddress: false,
}

export class Order extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...INITIAL_STATE,
      creator: {},
    }
    this.searchCustomer = loDebounce(this.searchCustomer, 300)
    this.applyProductsModal = this.applyProductsModal.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.cancelProductsModal = this.cancelProductsModal.bind(this)
    this.applyProductsModal = this.applyProductsModal.bind(this)
    this.changeProductsModal = this.changeProductsModal.bind(this)
    this.removeOrderProduct = this.removeOrderProduct.bind(this)
    this.mapCustomerFromPhone = this.mapCustomerFromPhone.bind(this)
    this.changeOrderProductQuantityModal = this.changeOrderProductQuantityModal.bind(this)
    this.searchCustomer = this.searchCustomer.bind(this)
    this.validateData = this.validateData.bind(this)
    this.onClickSubmit = this.onClickSubmit.bind(this)
    this.resetData = this.resetData.bind(this)
    this.changeOrderRealPriceModal = this.changeOrderRealPriceModal.bind(this)
  }

  componentDidMount() {
    const {
      getProductsToOrderRequest,
      getOrderRequest,
    } = this.props
    const { user } = this.props

    const orderID = R.path(
      ['match', 'params', 'orderID'],
      this.props,
    )

    getProductsToOrderRequest({})
    this.setState({
      creator: user,
    })

    if (orderID) {
      getOrderRequest(orderID, (order) => {
        const creator = order.creator || {}
        const implementer = order.implementer || {}
        const products = order.orderProductInfo || []
        const productsSelected = products.map(item => {
          const product = item.product || {}
          const orderQuantity = item.orderQuantity
          return {
            ...product,
            orderQuantity,
            orderRealPrice: item.orderRealPrice,
          }
        })
        const customer = order.customer || {}
        const productsData = JSON.parse(JSON.stringify(productsSelected))
        this.setState({
          customerID: customer.id,
          implementer,
          creator,
          customer,
          orderID: order.id,
          isEditable: order.status !== ORDER_STATUS.DONE,
          productsSelected,
          productsData,
          ...customer,
          ...order,
          originalOrder: order,
        })
      })
    }
  }

  toggleModal() {
    this.setState({
      visible: !this.state.visible,
    })
  }

  cancelProductsModal(actionSuccess) {
    this.setState({
      visible: false,
      productsSelected: JSON.parse(JSON.stringify(this.state.productsData)),
    }, () => {
      if (actionSuccess) actionSuccess()
    })
  }

  applyProductsModal() {
    let { productsSelected } = this.state
    productsSelected = productsSelected.filter(item => item.orderQuantity > 0)
    this.setState({
      visible: false,
      productsSelected,
      productsData: JSON.parse(JSON.stringify(productsSelected)),
    })
  }

  changeProductsModal(event, product) {
    const { productsSelected } = this.state
    const { target } = event
    const { checked, id } = target
    product.orderRealPrice = product.price
    if (checked) {
      productsSelected.push(product)
    } else {
      const idx = productsSelected.findIndex(e => e.id === id)
      productsSelected.splice(idx, 1)
    }
    this.setState({
      productsSelected,
    })
  }

  changeOrderProductQuantityModal(value, product) {
    const { productsSelected, type, originalOrder } = this.state

    const selectedIndex = productsSelected.findIndex(item => product.id === item.id)

    if (selectedIndex < 0 || value < 0) return

    if (type === ORDER_TYPES.EXPORT) {
      const indexOriginal = loGet(originalOrder, ['products'], [])
        .findIndex(item => loGet(item, ['product', 'id']) === product.id)
      if (
        (indexOriginal < 0 && value > product.quantity)
        || (indexOriginal >= 0 && value > product.quantity + loGet(originalOrder, ['products', indexOriginal, 'orderQuantity']))
      ) {
        return
      }
    }
    productsSelected[selectedIndex].orderQuantity = value
    this.setState({ productsSelected })
  }

  changeOrderRealPriceModal(value, product) {
    const { productsSelected } = this.state

    const selectedIndex = productsSelected.findIndex(item => product.id === item.id)

    if (selectedIndex < 0 || value < 0) return

    productsSelected[selectedIndex].orderRealPrice = value
    this.setState({ productsSelected })
  }

  removeOrderProduct(productID) {
    const { productsSelected, productsData, type, orderID } = this.state
    const { updateOrderProduct } = this.props
    const idx = productsSelected.findIndex(e => e.id === productID)

    const updateProduct = productsSelected[idx]

    productsSelected.splice(idx, 1)
    productsData.splice(idx, 1)

    this.setState({
      productsSelected,
      productsData,
    }, () => {
      if (!orderID || type !== ORDER_TYPES.EXPORT) return

      const currentOrderQuantity = updateProduct.orderQuantity
      updateProduct.quantity += currentOrderQuantity
      delete updateProduct.orderQuantity
      delete updateProduct.orderRealPrice

      updateOrderProduct(updateProduct)
    })
  }

  searchCustomer(value) {
    const { getCustomerBaseOnPhone } = this.props
    getCustomerBaseOnPhone(value)
  }

  mapCustomerFromPhone(phoneNumberValue) {
    const { isSelectAsReceiverPhoneNumber, receiverPhoneNumber } = this.state
    const { customers } = this.props
    const customer = customers[0].isFound
      ? customers.filter(customer => customer.phoneNumber === phoneNumberValue)
      : []
    const hasCustomer = !!this.state.customerID || customer.length > 0

    const tempState = {
      phoneNumber: phoneNumberValue,
      customer: customer[0],
      customerID: customer.length > 0 ? customer[0].id : '',
      receiverPhoneNumber: isSelectAsReceiverPhoneNumber ? phoneNumberValue : receiverPhoneNumber,
    }

    if (hasCustomer) {
      tempState.fullname = customer.length > 0 ? customer[0].fullname : ''
      tempState.address = customer.length > 0 ? customer[0].address : ''
    } else {
      tempState.fullname = this.state.fullname
      tempState.address = this.state.address
    }

    this.setState({
      ...tempState,
    })
  }

  validateData(actionSuccess) {
    const {
      type,
      productsData,
      customerID,
      status,
      address,
      fullname,
      phoneNumber,
      originalOrder,
      receiverAddress,
      receiverFullname,
      receiverPhoneNumber,
    } = this.state

    const error = {
      customer: {},
      receiver: {},
    }

    if (type !== ORDER_TYPES.IMPORT) {
      error.receiver = userValidation(receiverPhoneNumber, receiverFullname, receiverAddress)
      if (!customerID) error.customer = userValidation(phoneNumber, fullname, address)
    }

    if (!type) {

      error.orderType = 'PleaseSelectOrderType'
    }

    if (productsData.length <= 0) {

      error.products = 'PleaseSelectProducts'
    } else {
      for (let i = 0; i < productsData.length; i++) {
        const item = productsData[i]
        if (type === ORDER_TYPES.EXPORT) {
          const indexOriginal = loGet(originalOrder, ['orderProductInfo'], [])
            .findIndex(itemOriginal => loGet(itemOriginal, ['product', 'id']) === item.id)
          if (
            (indexOriginal < 0 && item.orderQuantity > item.quantity)
            || (indexOriginal >= 0 && item.orderQuantity > item.quantity + loGet(originalOrder, ['orderProductInfo', indexOriginal, 'orderQuantity']))
          ) {
            error.orderQuantity = 'IncorrectOrderQuantity'
            productsData[i].validOrderQuantity = false
          }
        }
        if (!item.orderQuantity || item.orderQuantity <= 0) {
          error.orderQuantity = 'IncorrectOrderQuantity'
          productsData[i].validOrderQuantity = false
        }

        if (!item.orderRealPrice && item.orderRealPrice < 0) {
          error.orderRealPrice = 'InvalidProductOrderRealPrice'
          productsData[i].validOrderQuantity = false
        }
      }
    }

    if (!status) {
      error.orderStatus = 'PleaseSelectOrderStatus'
    }
    this.setState({
      error,
    }, () => {
      const { error } = this.state
      const checkError = Object.keys(error).length === 2
        && Object.keys(error.customer).length === 0
        && Object.keys(error.receiver).length === 0
      if (actionSuccess && checkError) actionSuccess()
    })
  }

  resetData() {
    this.setState({
      ...INITIAL_STATE,
    })
  }

  onClickSubmit() {
    const {
      type,
      note,
      customerID,
      status,
      receiverPhoneNumber,
      receiverAddress,
      receiverFullname,
      productsData,
      fullname,
      address,
      phoneNumber,
      orderID,
      originalOrder,
    } = this.state

    const {
      createOrderRequest,
      updateOrderRequest,
      getProductsToOrderRequest,
    } = this.props

    let params = {
      orderProductInfo: productsData.map(item => ({
        productID: item.id,
        orderQuantity: item.orderQuantity,
        orderRealPrice: item.orderRealPrice,
      })),
      note,
      status,
      receiverPhoneNumber,
      receiverAddress,
      receiverFullname,
    }

    if (!orderID) {
      params = {
        ...params,
        customerID,
        type,
      }
      const objCustomer = {
        customerFullname: fullname,
        customerAddress: address,
        customerPhoneNumber: phoneNumber,
      }

      params = customerID ? params : {
        ...params,
        ...objCustomer,
      }
      createOrderRequest(params, () => {
        getProductsToOrderRequest({})
        this.resetData()
      })
      return
    }
    updateOrderRequest(orderID, params, originalOrder)
  }

  renderTableProducts() {
    const {
      productsData,
      isEditable,
      orderID,
      originalOrder,
    } = this.state

    const productColumns = [
      {
        Header: <FormattedMessage {...messages.ProductName} />,
        accessor: 'name',
      },
      {
        Header: <FormattedMessage {...messages.OrderRealPrice} />,
        accessor: 'orderRealPrice',
        Cell: row => {
          const value = row.value
          const validOrderQuantity = loGet(row, ['original', 'validOrderRealPrice'])
          return (
            <Typography.Text
              style={{ color: validOrderQuantity === false ? 'red' : 'green' }}
            >{`${numeral(value).format('0,0')} VND`}
            </Typography.Text>
          )
        },
      },
      {
        Header: <FormattedMessage {...messages.ProductPrice} />,
        accessor: 'price',
        Cell: row => `${numeral(row.value).format('0,0')} VND`,
      },
      {
        Header: <FormattedMessage {...messages.OrderQuantity} />,
        accessor: 'orderQuantity',
        Cell: row => {
          const value = row.value
          const validOrderQuantity = loGet(row, ['original', 'validOrderQuantity'])
          return (
            <Typography.Text
              style={{ color: validOrderQuantity === false ? 'red' : 'green' }}
            >{value}
            </Typography.Text>
          )
        },
      },
      {
        Header: <FormattedMessage {...messages.Quantity} />,
        accessor: 'quantity',
      },
      {
        Header: <FormattedMessage {...messages.Actions} />,
        accessor: 'id',
        Cell: row => (
          <Button
            disabled={!!orderID && !isEditable || originalOrder.status === ORDER_STATUS.DELIVERING}
            onClick={() => this.removeOrderProduct(row.value)}
            type="danger"
            icon="delete"
          >
          </Button>
        ),
        width: 150,
      },
    ]

    return (<ReactTable
      data={productsData}
      columns={productColumns}
      showPageSizeOptions={false}
      showPaginationBottom={false}
      noDataText={<FormattedMessage {...messages.NoProducts} />}
      style={{ height: 350 }}
      er
    />)
  }


  render() {
    const {
      visible,
      productsSelected,
      fullname,
      phoneNumber,
      address,
      error,
      isEditable,
      customerID,
      customer,
      creator,
      implementer,
      createdAt,
      type,
      status,
      note,
      orderID,
      updatedAt,
      receiverPhoneNumber,
      receiverFullname,
      receiverAddress,
      isSelectAsReceiverPhoneNumber,
      isSelectAsReceiverFullname,
      isSelectAsReceiverAddress,
      originalOrder,
    } = this.state

    const {
      products,
      customers,
      isGettingCustomers,
      intl,
      showCustomerFormModal,
      isCreatingOrder,
      isUpdatingOrder,
      history,
      user,
    } = this.props

    const queryParams = queryString.parse(loGet(this.props, ['location', 'search'], '').slice(1))



    return (
      <Layout className="order">
        <Helmet>
          {
            <title>{!orderID ?
              intl.formatMessage(messages.CreateOrder) :
              intl.formatMessage(messages.DetailOrder)
            }</title>
          }
          <meta
            name="description"
            content={<FormattedMessage {...messages.CreateProduct} />}
          />
        </Helmet>
        <Layout.Header className="flex flex--stretch">
          {
            (status === ORDER_STATUS.DONE && orderID && !isEditable) ?
              <div>
                <Typography.Text
                  style={{ fontSize: 16, color: '#c41d7f' }}
                  strong
                >
                  {`${intl.formatMessage(messages.OrderStatus)}: ${messages[status] ? intl.formatMessage(messages[status]) : status}`}
                </Typography.Text>
              </div>
              :
              <Col span={24} >
                <Button
                  onClick={() => {
                    this.validateData(() => {
                      this.onClickSubmit()
                    })
                  }}
                  ghost
                  className="mr-1 ml-1"
                  style={{ fontWeight: 'bold' }}
                  type="primary"
                  loading={orderID ? isUpdatingOrder : isCreatingOrder}
                >
                  {orderID ? <FormattedMessage {...messages.Update} /> : <FormattedMessage {...messages.Create} />}
                </Button>
                <Button
                  ghost
                  type="primary"
                  className="ml-1"
                  style={{ fontWeight: 'bold', borderColor: '#f86c6b', color: '#f86c6b' }}
                  disabled={orderID ? isUpdatingOrder : isCreatingOrder}
                  onClick={() => {
                    history.goBack()
                  }}
                >
                  <FormattedMessage {...messages.Cancel} />
                </Button>
              </Col>
          }
        </Layout.Header>
        <Layout.Content>
          <Row gutter={16}>
            <Col span={14} xl={14} lg={14} md={14} sm={24} xs={24}>
              <Card
                bordered={false}
                className="mb-4"
                title={<FormattedMessage {...messages.OrderInformation} />}
              >
                <Row gutter={24}>
                  <Col span={24} xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Form.Item
                      label={<FormattedMessage {...messages.OrderType} />}
                      colon={false}
                      help={error && error.orderType ?
                        <FormattedMessage {...messages[error.orderType]} />
                        : null}
                      required
                      hasFeedback={error && error.orderType}
                      validateStatus={!(error && error.orderType) ? 'success' : 'error'}
                    >
                      <Select
                        placeholder={<FormattedMessage {...messages.PleaseSelectOrderType} />}
                        disabled={!isEditable || !!orderID}
                        value={type}
                        style={{ width: '100%' }}
                        onChange={(value) => {
                          this.setState({
                            type: value,
                            productsSelected: [],
                            productsData: [],
                            status: status === ORDER_STATUS.DELIVERING && value === ORDER_TYPES.IMPORT ? '' : status,
                          })
                        }}
                      >
                        {
                          Object.keys(ORDER_TYPES).map(item =>
                            <Select.Option key={ORDER_TYPES[item]} value={ORDER_TYPES[item]}>
                              {messages[ORDER_TYPES[item]] ? intl.formatMessage(messages[ORDER_TYPES[item]]) : ORDER_TYPES[item]}
                            </Select.Option>
                          )
                        }
                      </Select>
                    </Form.Item>

                  </Col>
                  <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Form.Item
                      label={<FormattedMessage {...messages.OrderStatus} />}
                      colon={false}
                      help={error && error.orderStatus ?
                        <FormattedMessage {...messages[error.orderStatus]} />
                        : null}
                      required
                      hasFeedback={error && error.orderStatus}
                      validateStatus={!(error && error.orderStatus) ? 'success' : 'error'}
                    >
                      <Select
                        placeholder={<FormattedMessage {...messages.PleaseSelectOrderStatus} />}
                        disabled={!isEditable}
                        value={status}
                        style={{ width: '100%' }}
                        onChange={(value) => {
                          this.setState({ status: value })
                        }}
                      >
                        {
                          Object.keys(ORDER_STATUS).map(item =>
                            <Select.Option
                              key={ORDER_STATUS[item]}
                              value={ORDER_STATUS[item]}
                              disabled={
                                (type === ORDER_TYPES.IMPORT && ORDER_STATUS[item] === ORDER_STATUS.DELIVERING)
                                || (orderID && ORDER_STATUS[item] === ORDER_STATUS.CREATED && status === ORDER_STATUS.DELIVERING)
                              }
                            >
                              {messages[ORDER_STATUS[item]] ? intl.formatMessage(messages[ORDER_STATUS[item]]) : ORDER_STATUS[item]}
                            </Select.Option>
                          )
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label={<FormattedMessage {...messages.Note} />}
                  colon={false}
                >
                  <Input.TextArea
                    disabled={!isEditable}
                    value={note}
                    rows={5}
                    onChange={(event) => this.setState({ note: loGet(event, ['target', 'value']) })}
                  />
                </Form.Item>
              </Card>
              <Card
                className="mb-4"
                bordered={false}
                title={
                  <div>
                    <span className="flex flex--stretch">
                      <span>
                        <FormattedMessage {...messages.Products} />
                      </span>
                      <Tooltip
                        placement="top"
                        title={type ?
                          <FormattedMessage {...messages.AddProducts} /> :
                          <FormattedMessage {...messages.PleaseSelectOrderTypeToSelectProducts} />
                        }
                      >
                        <Button
                          disabled={!type || !isEditable || originalOrder.status === ORDER_STATUS.DELIVERING}
                          onClick={this.toggleModal}
                          type="primary"
                          icon="plus"
                        />
                      </Tooltip>
                    </span>
                  </div>
                }
              >
                {error && error.products ?
                  <span
                    style={{ color: 'red' }}
                  ><FormattedMessage {...messages[error.products]} /></span>
                  : null
                }
                {error && error.orderQuantity ?
                  <span
                    style={{ color: 'red' }}
                  ><FormattedMessage {...messages[error.orderQuantity]} /></span>
                  : null
                }
                {this.renderTableProducts()}
                <ItemsModal
                  searchText={intl.formatMessage(messages.SearchProductsText)}
                  titleText={intl.formatMessage(messages.Products)}
                  visible={visible}
                  itemsSelected={productsSelected}
                  items={JSON.parse(JSON.stringify(products))}
                  cancelItems={this.cancelProductsModal}
                  applyItems={this.applyProductsModal}
                  changeItems={this.changeProductsModal}
                  changeSelectedQuantity={this.changeOrderProductQuantityModal}
                  changeSelectedRealPrice={this.changeOrderRealPriceModal}
                  imageFieldName='mainPhoto'
                  ableAllItem={type === ORDER_TYPES.IMPORT}
                />
              </Card>
            </Col>
            <Col span={10} xl={10} lg={10} md={10} sm={24} xs={24}>
              {type !== ORDER_TYPES.IMPORT ?
                <div>
                  {/* Customer */}
                  < Card
                    className="mb-4"
                    bordered={false}
                    title={
                      <span className="flex flex--stretch">
                        {<FormattedMessage {...messages.CustomerInformation} />}
                        {
                          customerID
                            ? <div>
                              <Tooltip
                                placement="top"
                                title={<FormattedMessage {...messages.EditCustomer} />}
                              >
                                <Button
                                  disabled={!isEditable && orderID}
                                  onClick={() => {
                                    showCustomerFormModal(customer, (customer) => this.setState({
                                      phoneNumber: customer.phoneNumber,
                                      fullname: customer.fullname,
                                      address: customer.address,
                                      customerID: customer.id,
                                      customer,
                                    }))
                                  }}
                                  type="primary"
                                  icon="edit"
                                />
                              </Tooltip>
                            </div>
                            : null
                        }
                      </span>
                    }
                  >
                    <CustomerFormModal
                      customer={customer}
                      updateCustomerUI={this.updateCustomerUI}
                    />
                    <Row gutter={16}>
                      <Col span={16} xs={20} sm={20} md={16} lg={16} xl={16}>
                        <Form.Item
                          label={<FormattedMessage {...messages.CustomerPhone} />}
                          colon={false}
                          required
                          hasFeedback={!!loGet(error, ['customer', 'phoneNumberMessage'])}
                          validateStatus={!loGet(error, ['customer', 'phoneNumberMessage']) ? 'success' : 'error'}
                          help={
                            !loGet(error, ['customer', 'phoneNumberMessage']) ?
                              null
                              : <FormattedMessage {...messages[loGet(error, ['customer', 'phoneNumberMessage'])]} />
                          }
                        >
                          <CustomerPhoneSelect
                            disabled={
                              !!orderID || !!queryParams.customerID
                            }
                            customers={customers}
                            isGettingCustomers={isGettingCustomers}
                            value={phoneNumber}
                            searchCustomer={this.searchCustomer}
                            placeholder={intl.formatMessage(messages.FindOrCreatePhone)}
                            changeCustomer={this.mapCustomerFromPhone}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2} xs={2} sm={2} md={2} lg={2} xl={2}>
                        <Form.Item
                          label=" "
                          colon={false}
                        >
                          <Tooltip
                            title={<FormattedMessage {...messages.SelectAsTheReceiverPhoneNumber} />}
                          >
                            <Checkbox
                              disabled={
                                orderID && originalOrder.status !== ORDER_STATUS.CREATED
                              }
                              checked={isSelectAsReceiverPhoneNumber}
                              onChange={() => {
                                const isSelected = !isSelectAsReceiverPhoneNumber
                                const objUpdate = { isSelectAsReceiverPhoneNumber: isSelected }
                                if (isSelected) {
                                  objUpdate.receiverPhoneNumber = phoneNumber
                                }
                                this.setState(objUpdate)
                              }}
                            >
                            </Checkbox>
                          </Tooltip>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={16} xs={20} sm={20} md={16} lg={16} xl={16}>
                        <Form.Item
                          label={<FormattedMessage {...messages.CustomerName} />}
                          colon={false}
                          required
                          hasFeedback={!!loGet(error, ['customer', 'fullnameMessage'])}
                          validateStatus={!loGet(error, ['customer', 'fullnameMessage']) ? 'success' : 'error'}
                          help={
                            !loGet(error, ['customer', 'fullnameMessage']) ?
                              null
                              : <FormattedMessage {...messages[loGet(error, ['customer', 'fullnameMessage'])]} />
                          }
                        >
                          <Input
                            disabled={!!customerID}
                            placeholder={intl.formatMessage(messages.FillCustomerFullname)}
                            value={fullname}
                            onChange={(event) => {
                              this.setState({
                                fullname: event.target.value,
                                receiverFullname: isSelectAsReceiverFullname ? event.target.value : receiverFullname,
                              })
                            }}
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2} xs={2} sm={2} md={2} lg={2} xl={2}>
                        <Form.Item
                          label=" "
                          colon={false}
                        >
                          <Tooltip
                            title={<FormattedMessage {...messages.SelectAsTheReceiverFullname} />}
                          >
                            <Checkbox
                              disabled={
                                orderID && originalOrder.status !== ORDER_STATUS.CREATED
                              }
                              checked={isSelectAsReceiverFullname}
                              onChange={() => {
                                const isSelected = !isSelectAsReceiverFullname
                                const objUpdate = { isSelectAsReceiverFullname: isSelected }
                                if (isSelected) {
                                  objUpdate.receiverFullname = fullname
                                }
                                this.setState(objUpdate)
                              }}
                            >
                            </Checkbox>
                          </Tooltip>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={22} xs={22} sm={22} md={22} lg={22} xl={22}>
                        <Form.Item
                          label={<FormattedMessage {...messages.CustomerAddress} />}
                          colon={false}
                          required
                          hasFeedback={!!loGet(error, ['customer', 'addressMessage'])}
                          validateStatus={!loGet(error, ['customer', 'addressMessage']) ? 'success' : 'error'}
                          help={
                            !loGet(error, ['customer', 'addressMessage']) ?
                              null
                              : <FormattedMessage {...messages[loGet(error, ['customer', 'addressMessage'])]} />
                          }
                        >
                          <Input
                            disabled={!!customerID}
                            placeholder={intl.formatMessage(messages.FillCustomerAddress)}
                            value={address}
                            onChange={(event) => {
                              this.setState({
                                address: event.target.value,
                                receiverAddress: isSelectAsReceiverAddress ? event.target.value : receiverAddress,
                              })
                            }}
                            prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2} xs={2} sm={2} md={2} lg={2} xl={2}>
                        <Form.Item
                          label=" "
                          colon={false}
                        >
                          <Tooltip
                            title={<FormattedMessage {...messages.SelectAsTheReceiverAddress} />}
                          >
                            <Checkbox
                              disabled={
                                orderID && originalOrder.status !== ORDER_STATUS.CREATED
                              }
                              value={isSelectAsReceiverAddress}
                              onChange={() => {
                                const isSelected = !isSelectAsReceiverAddress
                                const objUpdate = { isSelectAsReceiverAddress: isSelected }
                                if (isSelected) {
                                  objUpdate.receiverAddress = address
                                }
                                this.setState(objUpdate)
                              }}
                            >
                            </Checkbox>
                          </Tooltip>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                  {/* Receiver */}
                  < Card
                    className="mb-4"
                    bordered={false}
                    title={
                      <span className="flex flex--stretch">
                        {<FormattedMessage {...messages.ReceiverInformation} />}
                      </span>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={16} xs={20} sm={20} md={16} lg={16} xl={16}>
                        <Form.Item
                          label={<FormattedMessage {...messages.ReceiverPhone} />}
                          colon={false}
                          required
                          hasFeedback={!!loGet(error, ['receiver', 'phoneNumberMessage'])}
                          validateStatus={!loGet(error, ['receiver', 'phoneNumberMessage']) ? 'success' : 'error'}
                          help={
                            !loGet(error, ['receiver', 'phoneNumberMessage']) ?
                              null
                              : <FormattedMessage {...messages[loGet(error, ['receiver', 'phoneNumberMessage'])]} />
                          }
                        >
                          <Input
                            placeholder={intl.formatMessage(messages.PleaseFillReceiverMobilePhone)}
                            disabled={isSelectAsReceiverPhoneNumber ||
                              (orderID && originalOrder.status !== ORDER_STATUS.CREATED)
                            }
                            value={receiverPhoneNumber}
                            onChange={(event) => {
                              this.setState({ receiverPhoneNumber: event.target.value })
                            }}
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={16} xs={20} sm={20} md={16} lg={16} xl={16}>
                        <Form.Item
                          label={<FormattedMessage {...messages.ReceiverName} />}
                          colon={false}
                          required
                          hasFeedback={!!loGet(error, ['receiver', 'fullnameMessage'])}
                          validateStatus={!loGet(error, ['receiver', 'fullnameMessage']) ? 'success' : 'error'}
                          help={
                            !loGet(error, ['receiver', 'fullnameMessage']) ?
                              null
                              : <FormattedMessage {...messages[loGet(error, ['receiver', 'fullnameMessage'])]} />
                          }
                        >
                          <Input
                            placeholder={intl.formatMessage(messages.PleaseFillReceiverName)}
                            disabled={isSelectAsReceiverFullname ||
                              (orderID && originalOrder.status !== ORDER_STATUS.CREATED)
                            }
                            value={receiverFullname}
                            onChange={(event) => {
                              this.setState({ receiverFullname: event.target.value })
                            }}
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      label={<FormattedMessage {...messages.ReceiverAddress} />}
                      colon={false}
                      required
                      hasFeedback={!!loGet(error, ['receiver', 'addressMessage'])}
                      validateStatus={!loGet(error, ['receiver', 'addressMessage']) ? 'success' : 'error'}
                      help={
                        !loGet(error, ['receiver', 'addressMessage']) ?
                          null
                          : <FormattedMessage {...messages[loGet(error, ['receiver', 'addressMessage'])]} />
                      }
                    >
                      <Input
                        placeholder={intl.formatMessage(messages.FillReceiverAddress)}
                        disabled={isSelectAsReceiverAddress ||
                          (orderID && originalOrder.status !== ORDER_STATUS.CREATED)
                        }
                        value={receiverAddress}
                        onChange={(event) => this.setState({ receiverAddress: event.target.value })}
                        prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      />
                    </Form.Item>
                  </Card>
                </div> : null}
              {/* Creator */}
              <Card
                bodyStyle={{ paddingRight: 0 }}
                className="mb-4"
                bordered={false}
                title={<FormattedMessage {...messages.CreatorInformation} />}
              >
                <Row
                  align="top"
                  type="flex"
                >
                  <Col
                    xxl={4} xl={6} lg={8} md={8} sm={4} xs={4} >
                    <Avatar
                      style={{
                        lineHeight: '57px',
                        top: 4,
                      }}
                      className="avatar__object-fit--cover"
                      size={65}
                      shape="square"
                      icon="user"
                      src={orderID ? loGet(creator, ['avatar']) : loGet(user, ['avatar'])}
                    />
                  </Col>
                  <Col
                    xxl={20} xl={18} lg={16} md={16} sm={20} xs={20} >
                    <Row className="mb-2">
                      <Col
                        xxl={6} xl={8} lg={10} md={10} sm={6} xs={6} >
                        <Typography.Text strong>
                          <FormattedMessage {...messages.CreatedAt} />
                        </Typography.Text>
                      </Col>
                      <Col
                        xxl={18} xl={16} lg={14} md={14} sm={18} xs={18} >
                        <Typography.Text>
                          {createdAt ? moment(createdAt).locale('vn').format("LT - L") : moment().locale('vn').format("L")}
                        </Typography.Text>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col
                        xxl={6} xl={8} lg={10} md={10} sm={6} xs={6} >
                        <Typography.Text strong>
                          <FormattedMessage {...messages.CreatorFullname} />
                        </Typography.Text>
                      </Col>
                      <Col
                        xxl={18} xl={16} lg={14} md={14} sm={18} xs={18} >
                        <Typography.Text>
                          {loGet(creator, ['fullname'], '')}
                        </Typography.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        xxl={6} xl={8} lg={10} md={10} sm={6} xs={6} >
                        <Typography.Text strong>
                          <FormattedMessage {...messages.CreatorRole} />
                        </Typography.Text>
                      </Col>
                      <Col
                        xxl={18} xl={16} lg={14} md={14} sm={18} xs={18}>
                        <Typography.Text>
                          {
                            messages[loGet(creator, ['role'], '')]
                              ? <FormattedMessage {...messages[loGet(creator, ['role'], '')]} />
                              : loGet(creator, ['role'], '')
                          }
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
              {/* Implementer */}
              {orderID && status === ORDER_STATUS.DONE ? <Card
                bodyStyle={{ paddingRight: 0 }}
                className="mb-4"
                bordered={false}
                title={<FormattedMessage {...messages.ImplementerInformation} />}
              >
                <Row
                  align="top"
                  type="flex"
                >
                  <Col
                    xxl={4} xl={6} lg={8} md={8} sm={4} xs={4} >
                    <Avatar
                      style={{
                        lineHeight: '57px',
                        top: 4,
                      }}
                      className="avatar__object-fit--cover"
                      size={65}
                      shape="square"
                      icon="user"
                      src={loGet(implementer, ['avatar'])}
                    />
                  </Col>
                  <Col
                    xxl={20} xl={18} lg={16} md={16} sm={20} xs={20} >
                    <Row className="mb-2">
                      <Col
                        xxl={6} xl={8} lg={10} md={10} sm={6} xs={6} >
                        <Typography.Text strong>
                          <FormattedMessage {...messages.CompletedAt} />
                        </Typography.Text>
                      </Col>
                      <Col
                        xxl={18} xl={16} lg={14} md={14} sm={18} xs={18} >
                        <Typography.Text>
                          {updatedAt ? moment(updatedAt).locale('vn').format("LT - L") : ''}
                        </Typography.Text>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col
                        xxl={6} xl={8} lg={10} md={10} sm={6} xs={6} >
                        <Typography.Text strong>
                          <FormattedMessage {...messages.ImplementerFullname} />
                        </Typography.Text>
                      </Col>
                      <Col
                        xxl={18} xl={16} lg={14} md={14} sm={18} xs={18} >
                        <Typography.Text>
                          {loGet(implementer, ['fullname'], '')}
                        </Typography.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        xxl={6} xl={8} lg={10} md={10} sm={6} xs={6} >
                        <Typography.Text strong>
                          <FormattedMessage {...messages.ImplementerRole} />
                        </Typography.Text>
                      </Col>
                      <Col
                        xxl={18} xl={16} lg={14} md={14} sm={18} xs={18}>
                        <Typography.Text>
                          {
                            messages[loGet(implementer, ['role'], '')]
                              ? <FormattedMessage {...messages[loGet(implementer, ['role'], '')]} />
                              : loGet(implementer, ['role'], '')
                          }
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card> : null}
            </Col>
          </Row>
        </Layout.Content>
      </Layout >
    )
  }
}

Order.propTypes = {
  getCustomerBaseOnPhone: PropTypes.func,
  customers: PropTypes.array,
  user: PropTypes.object,
  isGettingCustomers: PropTypes.bool,
  hideCustomerFormModal: PropTypes.func,
  customer: PropTypes.object,
  confirm: PropTypes.func,
  getCustomerBaseOnID: PropTypes.func,
  showCustomerFormModal: PropTypes.func,
  products: PropTypes.array,
  getProductsToOrderRequest: PropTypes.func,
  createOrderRequest: PropTypes.func,
  order: PropTypes.object,
  isCreatingOrder: PropTypes.bool,
  isUpdatingOrder: PropTypes.bool,
  updateOrderRequest: PropTypes.func,
  updateOrderProduct: PropTypes.func,
}

const withReducer = injectReducer({ key: 'order', reducer })
const withSaga = injectSaga({ key: 'order', saga })

const mapStateToProps = state => {
  const user = state.user.toJS().user
  const order = state.order.toJS()

  return {
    user,
    ...order,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getCustomerBaseOnPhone: (phoneNumber) =>
      dispatch(OrderActions.getCustomerBaseOnPhone(phoneNumber)),
    showCustomerFormModal: (customer, actionSuccess) =>
      dispatch(CustomerFormActions.showCustomerFormModal(customer, '', actionSuccess)),
    hideCustomerFormModal: () =>
      dispatch(CustomerFormActions.hideCustomerFormModal()),
    confirm: (title, content, okText, cancelText, actionSuccess, actionFailure) =>
      dispatch(AppActions.confirm(title, content, okText, cancelText, actionSuccess, actionFailure)),
    getCustomerBaseOnID: (customerID, actionSuccess) =>
      dispatch(OrderActions.getCustomerBaseOnID(customerID, actionSuccess)),
    getProductsToOrderRequest: (params, actionSuccess) =>
      dispatch(OrderActions.getProductsToOrderRequest(params, actionSuccess)),
    createOrderRequest: (params, actionSuccess) =>
      dispatch(OrderActions.createOrderRequest(params, actionSuccess)),
    getOrderRequest: (orderID, actionSuccess) =>
      dispatch(OrderActions.getOrderRequest(orderID, actionSuccess)),
    updateOrderRequest: (orderID, params, originalOrder, actionSuccess) =>
      dispatch(OrderActions.updateOrderRequest(orderID, params, originalOrder, actionSuccess)),
    updateOrderProduct: (product) =>
      dispatch(OrderActions.updateOrderProduct(product)),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(injectIntl(Order))
