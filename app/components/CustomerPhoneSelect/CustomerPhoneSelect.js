import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { removePhonePrefix } from 'utils/helper'
import {
  Select,
} from 'antd'

class CustomerPhoneSelect extends PureComponent {
  render() {
    const {
      value,
      customers,
      isGettingCustomers,
      changeCustomer,
      searchCustomer,
      placeholder,
      disabled,
    } = this.props
    return (
      <Select
        onChange={changeCustomer}
        onSearch={searchCustomer}
        disabled={disabled}
        placeholder={placeholder}
        notFoundContent={null}
        showSearch
        value={value || undefined}
        loading={isGettingCustomers}
        style={{ width: '100%' }}
        optionLabelProp="value"
        filterOption={(inputValue, { props }) =>
          props.value.includes(removePhonePrefix(inputValue))}
      >
        {customers.map(customer => {
          if (!customer.isFound) {
            return (
              <Select.Option value={customer.phoneNumber} key={customer.phoneNumber}>
                {customer.phoneNumber}
              </Select.Option>
            )
          }
          return (
            <Select.Option value={customer.phoneNumber} key={customer._id}>
              {customer.phoneNumber} - {customer.fullname}
            </Select.Option>
          )
        })}
      </Select>
    )
  }
}

CustomerPhoneSelect.propTypes = {
  value: PropTypes.string,
  changeCustomer: PropTypes.func,
  searchCustomer: PropTypes.func,
  customers: PropTypes.array,
  isGettingCustomers: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
}

export default CustomerPhoneSelect