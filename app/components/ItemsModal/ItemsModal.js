import React, { Component } from 'react'
import {
  Col,
  Row,
  Badge,
} from 'reactstrap'
import {
  Modal,
  Avatar,
  Input,
  Card,
  Tooltip,
} from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import loGet from 'lodash/get'
import { formatCurrency } from 'utils/helper'
import messages from './messages'
import './items-modal.scss'

class ItemsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      itemsList: [],
    }
  }

  renderItems = (item) => {
    const temp = {}
    temp[item.id] = React.createRef()
    const {
      itemsSelected,
      changeItems,
      imageFieldName,
      changeSelectedQuantity,
      changeSelectedRealPrice,
      intl,
      ableAllItem,
    } = this.props

    const indexSelected = itemsSelected.findIndex(itemSelected => itemSelected.id === item.id)
    const orderQuantity = indexSelected >= 0 ? itemsSelected[indexSelected].orderQuantity : undefined
    const checkDisable = item.quantity <= 0 && !ableAllItem && !orderQuantity
    return (
      <Col
        xs={6} sm={4} md={4} lg={4} xl={4}
        className="mb-4"
        key={item.id}>
        <div
          className="tp-checkbox">
          <Card>
            <Row>
              <input
                type="checkbox"
                id={item.id}
                ref={temp[item.id]}
                onChange={(event) => changeItems(event, item)}
                checked={indexSelected !== -1}
              />

              <button
                className="tp-checkbox__button"
                type="button"
                onClick={() => temp[item.id].current.click()}
                disabled={checkDisable}
                style={checkDisable ? { backgroundColor: '#dddddd' } : {}}
              >
                <Avatar
                  src={item[imageFieldName]}
                  shape="square"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 5,
                    width: 'auto',
                    height: 'auto',
                  }}
                />
                <div className="tp-checkbox__name mb-2">
                  {item.name}
                </div>
                {item.price ?
                  <div>
                    <Badge color="warning">
                      {`${intl.formatMessage(messages.Price)}: ${formatCurrency(item.price)}`}
                    </Badge>
                  </div> : null
                }
                <div>
                  <Badge color="primary">
                    {`${intl.formatMessage(messages.Quantity)}: ${item.quantity}`}
                  </Badge>
                </div>
              </button>
            </Row>
            {/* Order quantity */}
            <Row
              style={{
                marginTop: 10,
                alignItems: 'center',
              }}>
              <label><FormattedMessage {...messages.OrderQuantity} /></label>
              <Col >
                {checkDisable || indexSelected < 0 ?
                  <Tooltip
                    overlayStyle={{ zIndex: 100000 }}
                    // eslint-disable-next-line consistent-return
                    title={() => {
                      if (checkDisable) {
                        return (<FormattedMessage {...messages.CannotSelectProductByOutOfStock} />)
                      }
                      if (indexSelected < 0) {
                        return (<FormattedMessage {...messages.PleaseSelectProductFirst} />)
                      }
                    }}
                    placement="topRight"
                  >
                    <Input
                      type="number"
                      min={0}
                      value={indexSelected < 0 ? '' : itemsSelected[indexSelected].orderQuantity}
                      disabled={checkDisable || indexSelected < 0}
                      onChange={(e) => {
                        const value = parseInt(loGet(e, ['target', 'value']))
                        changeSelectedQuantity(value, item)
                      }}
                    >
                    </Input>
                  </Tooltip> :
                  <Input
                    type="number"
                    min={0}
                    value={indexSelected < 0 ? '' : itemsSelected[indexSelected].orderQuantity}
                    disabled={checkDisable || indexSelected < 0}
                    onChange={(e) => {
                      const value = parseInt(loGet(e, ['target', 'value']))
                      changeSelectedQuantity(value, item)
                    }}
                  >
                  </Input>}
              </Col>
            </Row>
            {/* Order real price */}
            <Row
              style={{
                marginTop: 10,
                alignItems: 'center',
              }}>
              <label><FormattedMessage {...messages.OrderRealPrice} /></label>
              <Col >
                {checkDisable || indexSelected < 0 ?
                  <Tooltip
                    overlayStyle={{ zIndex: 100000 }}
                    // eslint-disable-next-line consistent-return
                    title={() => {
                      if (checkDisable) {
                        return (<FormattedMessage {...messages.CannotSelectProductByOutOfStock} />)
                      }
                      if (indexSelected < 0) {
                        return (<FormattedMessage {...messages.PleaseSelectProductFirst} />)
                      }
                    }}
                    placement="topRight"
                  >
                    <Input
                      type="number"
                      min={0}
                      value={indexSelected < 0 ? '' : itemsSelected[indexSelected].orderRealPrice}
                      disabled={checkDisable || indexSelected < 0}
                      onChange={(e) => {
                        const value = parseInt(loGet(e, ['target', 'value']))
                        changeSelectedRealPrice(value, item)
                      }}
                    >
                    </Input>
                  </Tooltip> :
                  <Input
                    type="number"
                    min={0}
                    value={indexSelected < 0 ? '' : itemsSelected[indexSelected].orderRealPrice}
                    disabled={checkDisable || indexSelected < 0}
                    onChange={(e) => {
                      const value = parseInt(loGet(e, ['target', 'value']))
                      changeSelectedRealPrice(value, item)
                    }}
                  >
                  </Input>}
              </Col>
            </Row>
          </Card>
        </div>
      </Col>
    )
  }

  resetForm = () => {
    const { items } = this.props

    this.setState({
      search: '',
      itemsList: items,
    })
  }

  onCancel = () => {
    const { cancelItems } = this.props
    cancelItems(() => { this.resetForm() })
  }

  onApply = async () => {
    const { applyItems } = this.props

    await applyItems()

    this.resetForm()
  }

  onSearch = (value) => {
    const { items } = this.props

    const regex = new RegExp(value, 'i')
    const elements = items.filter(item => regex.test(item.name))

    this.setState({
      search: value,
      itemsList: elements,
    })

  }

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      this.setState({  //eslint-disable-line 
        itemsList: Array.from(this.props.items),
      })
    }
  }

  render() {
    const {
      visible,
      titleText,
      searchText,
    } = this.props

    const { search, itemsList } = this.state

    return (
      <Modal
        centered
        title={titleText}
        width={750}
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onApply}
        bodyStyle={{ height: 450, overflow: 'scroll' }}
        zIndex={10000}
        cancelText={<FormattedMessage {...messages.CancelText} />}
        okText={<FormattedMessage {...messages.OkText} />}
      >
        <Row className="mb-4">
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <Input.Search
              placeholder={searchText}
              onChange={e => this.onSearch(e.target.value)}
              value={search}
            />
          </Col>
        </Row>

        <Row>
          {itemsList.map(this.renderItems)}
        </Row>
      </Modal>
    )
  }
}

ItemsModal.propTypes = {
  visible: PropTypes.bool,
  applyItems: PropTypes.func,
  cancelItems: PropTypes.func,
  changeItems: PropTypes.func,
  items: PropTypes.array,
  itemsSelected: PropTypes.array,
  titleText: PropTypes.string,
  intl: PropTypes.object,
  searchText: PropTypes.string,
  imageFieldName: PropTypes.string,
  changeSelectedQuantity: PropTypes.func,
  ableAllItem: PropTypes.bool,
}

export default injectIntl(ItemsModal)