import { isEmail } from 'validator'
import { removePhonePrefix, isMobilePhone } from 'utils/helper'

const customerFormModalValidation = (phoneNumber, fullname, email, source) => {
  const validation = { valid: true }
  if (phoneNumber && !isMobilePhone(removePhonePrefix(phoneNumber))) {
    validation.valid = false
    validation.phoneNumberMessage = 'pleaseFillCorrectTypeOfMobilePhone'
  }
  if (!fullname) {
    validation.valid = false
    validation.fullnameMessage = 'pleaseFillCustomerName'
  }
  if (email && !isEmail(email)) {
    validation.valid = false
    validation.emailMessage = 'pleaseFillCorrectTypeOfEmail'
  }
  if (!source) {
    validation.valid = false
    validation.sourceMessage = 'pleaseSelectCustomerSource'
  }
  return validation
}

export default customerFormModalValidation
