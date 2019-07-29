import numeral from 'numeral'

export function hexToRGB(h) {
  let r = 0; let g = 0; let b = 0

  // 3 digits
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`
    g = `0x${h[2]}${h[2]}`
    b = `0x${h[3]}${h[3]}`

    // 6 digits
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`
    g = `0x${h[3]}${h[4]}`
    b = `0x${h[5]}${h[6]}`
  }

  return { r, g, b }
}

export function getBrightness(h) {
  const rgb = hexToRGB(h)
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

export function isDark(h) {
  if (!h) return false

  return getBrightness(h) < 128
}

export function isMobilePhone(number) {
  const lengthNum = number.length
  const reg = /\d/g
  const numberPhone = number.match(reg, number)
  if (!numberPhone) return false
  const _length = numberPhone.length
  return (_length > 8 && lengthNum === _length)
}

const viPhonePrefixRegexp = /^(\+?0|\+?840|\+?84)|\+/

export function removePhonePrefix(phoneNumber) {
  let _result = phoneNumber
  if (phoneNumber) {
    _result = phoneNumber.replace(viPhonePrefixRegexp, '')
  }
  return _result
}

export const userValidation = (phoneNumber, fullname, address) => {
  const error = {}

  if (!phoneNumber) {

    error.phoneNumberMessage = 'PleaseFillMobilePhone'
  }

  if (phoneNumber && !isMobilePhone(removePhonePrefix(phoneNumber))) {

    error.phoneNumberMessage = 'PleaseFillCorrectTypeOfMobilePhone'
  }

  if (!fullname) {

    error.fullnameMessage = 'PleaseFillName'
  }

  if (!address){
    error.addressMessage = 'PleaseFillAddress'
  }

  return error
}

export const formatCurrency = price => {
  if (!price) return 'Free'
  return `${numeral(price).format('0,0')} VND`
}