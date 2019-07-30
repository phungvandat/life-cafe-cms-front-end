import { removePhonePrefix, isMobilePhone } from 'utils/helper'

const customerFormModalValidation = (phoneNumber, fullname) => {
  const validation = { valid: true }
  if (phoneNumber && !isMobilePhone(removePhonePrefix(phoneNumber))) {
    validation.valid = false
    validation.phoneNumberMessage = 'pleaseFillCorrectTypeOfMobilePhone'
  }
  if (!fullname) {
    validation.valid = false
    validation.fullnameMessage = 'pleaseFillCustomerName'
  }

  return validation
}

export default customerFormModalValidation
