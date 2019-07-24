import querystring from 'querystring'
import { request } from '../../configures/axios'

function getProducts(params) {
  return request.get(`/products?${querystring.stringify({ ...params })}`)
}

function deleteProduct(productID) {
  return request.delete(`/products/${productID}`)
}

export {
  getProducts,
  deleteProduct,
}
