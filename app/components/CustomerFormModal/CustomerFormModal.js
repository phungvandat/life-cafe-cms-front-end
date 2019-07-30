/**
 *
 * CustomerFormModal
 *
 */

import React from 'react'
import {
  Modal,
  Button,
  Form,
  Input,
  Icon,
  Row,
  Col,
} from 'antd'
import { FormattedMessage, injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { } from 'utils/constants'
import CustomerFormActions from './customerFormRedux'
import messages from './messages'
import customerFormModalValidation from './customerFormModalValidation'


/* eslint-disable react/prefer-stateless-function */
class CustomerFormModal extends React.Component {

  state = {
    phoneNumber: '',
    fullname: '',
    address: '',
    customerID: '',
    original: {},
    validation: {},
  }

  componentDidMount() { }

  changeValidationFields = () => {
    const {
      phoneNumber,
      fullname,
      validation,
    } = this.state
    if (
      validation.phoneNumberMessage
      || validation.fullnameMessage
      || validation.emailMessage
    ) {
      this.setState({
        validation: customerFormModalValidation(phoneNumber, fullname),
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isVisible === false && this.props.isVisible === true) {
      const { customer } = this.props
      if (Object.keys(customer).length > 0) {
        this.setState({ // eslint-disable-line
          ...customer,
          customerID: customer.id,
          original: customer,
        })
      }
    }

  }

  handleOk = () => {
    const {
      customerFormUpdateRequest,
      updateCustomerUI,
    } = this.props
    const {
      phoneNumber,
      fullname,
      address,
      customerID,
      original,
    } = this.state
    const params = {
      phoneNumber,
      fullname,
      address,
      original,
    }
    this.setState({
      validation: customerFormModalValidation(phoneNumber, fullname),
    }, () => {
      if (this.state.validation.valid) {
        customerFormUpdateRequest(customerID, params, customer => {
          if (updateCustomerUI) updateCustomerUI(customer)
          this.handleCancel()
        })
      }
    })
  }

  handleCancel = () => {
    this.props.hideCustomerFormModal()
  }

  resetForm = () => {
    this.setState({
      phoneNumber: '',
      fullname: '',
      address: '',
      customerID: '',
      original: {},
      validation: {},
    })
  }

  render() {
    const {
      isUpdating,
      isVisible,
      intl,
    } = this.props

    const {
      phoneNumber,
      fullname,
      address,
      validation,
    } = this.state

    return (
      <Modal
        visible={isVisible}
        zIndex={9000}
        width={600}
        title={<FormattedMessage {...messages.customerInformation} />}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.resetForm}
        footer={[
          <Button
            disabled={isUpdating}
            key="back"
            onClick={this.handleCancel}
          >
            <FormattedMessage {...messages.cancelText} />
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isUpdating}
            onClick={this.handleOk}
          >
            <FormattedMessage {...messages.okTextUpdate} />
          </Button>,
        ]}
      >
        <Row gutter={16}>
          <Col span={12} xs={24} sm={24} md={12} lg={12} xl={12}>
            <Form.Item
              label={<FormattedMessage {...messages.customerPhone} />}
              colon={false}
              hasFeedback={!!validation.phoneNumberMessage}
              validateStatus={!validation.phoneNumberMessage ? 'success' : 'error'}
              help={
                !validation.phoneNumberMessage ?
                  null
                  : <FormattedMessage {...messages[validation.phoneNumberMessage]} />
              }
              required
            >
              <Input
                type="text"
                placeholder={intl.formatMessage(messages.fillCustomerPhone)}
                prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                value={phoneNumber}
                onChange={e => this.setState({ phoneNumber: e.target.value }, () => {
                  this.changeValidationFields()
                })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16} xs={16} sm={16} md={16} lg={16} xl={16}>
            <Form.Item
              label={<FormattedMessage {...messages.customerName} />}
              colon={false}
              required
              hasFeedback={!!validation.fullnameMessage}
              validateStatus={!validation.fullnameMessage ? 'success' : 'error'}
              help={
                !validation.fullnameMessage ?
                  null
                  : <FormattedMessage {...messages[validation.fullnameMessage]} />
              }
            >
              <Input
                placeholder={intl.formatMessage(messages.fillCustomerFullname)}
                value={fullname}
                onChange={(event) => {
                  this.setState({ fullname: event.target.value }, () => {
                    this.changeValidationFields()
                  })
                }}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={<FormattedMessage {...messages.customerAddress} />}
          colon={false}
          required
        >
          <Input
            placeholder={intl.formatMessage(messages.fillCustomerAddress)}
            value={address}
            onChange={(event) => this.setState({ address: event.target.value })}
            prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </Form.Item>
      </Modal>
    )
  }
}

CustomerFormModal.propTypes = {
  customerFormUpdateRequest: PropTypes.func,
  hideCustomerFormModal: PropTypes.func,
  customer: PropTypes.object,
  isUpdating: PropTypes.bool,
  isVisible: PropTypes.bool,
  customerFormGetCustomerSourcesRequest: PropTypes.func,
  updateCustomerUI: PropTypes.func,
}

const mapStateToProps = (state) => ({
  isUpdating: state.customerForm.get('isUpdating'),
  isVisible: state.customerForm.get('isVisible'),
  customer: state.customerForm.toJS().customer,
})

function mapDispatchToProps(dispatch) {
  return {
    customerFormUpdateRequest: (customerID, params, actionSuccess) =>
      dispatch(CustomerFormActions.customerFormUpdateRequest(customerID, params, actionSuccess)),
    showCustomerFormModal: () => dispatch(CustomerFormActions.showCustomerFormModal()),
    hideCustomerFormModal: () => dispatch(CustomerFormActions.hideCustomerFormModal()),
    customerFormGetCustomerSourcesRequest: (actionSuccess) =>
      dispatch(CustomerFormActions.customerFormGetCustomerSourcesRequest(actionSuccess)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CustomerFormModal))
