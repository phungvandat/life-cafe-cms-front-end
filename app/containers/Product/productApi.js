import querystring from 'querystring'
import { request } from '../../configures/axios'

function getProduct(productID) {
  return request.get(`/products/${productID}`)
}

function createProduct(params) {
  return request.post('/products', params)
}

function updateProduct(productID, params) {
  return request.put(`/products/${productID}`, params)
}

function getCategories(params) {
  return request.get(`/categories?${querystring.stringify({ ...params })}`)
}

export {
  getProduct,
  createProduct,
  updateProduct,
  getCategories,
}
