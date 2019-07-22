import querystring from 'querystring'
import { request } from '../../configures/axios'

function getCategories(params) {
  return request.get(`/categories?${querystring.stringify({ ...params })}`)
}

function getCategory(categoryID) {
  return request.get(`/categories/${categoryID}`)
}

function createCategory(params) {
  return request.post('/categories', params)
}

function updateCategory(categoryID, params) {
  return request.put(`/categories/${categoryID}`, params)
}

function uploadImages(data) {
  return request.post('upload/images', data)
}

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  uploadImages,
}
