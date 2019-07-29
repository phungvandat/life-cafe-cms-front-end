import querystring from 'querystring'
import { request } from '../../configures/axios'

const getCustomerBaseOnPhone = (phoneNumber) =>
  request.get(`users?${querystring.stringify(
    { 
      phoneNumber,
      alwaysPhone: 'true',
    }
  )}`)

const getOrder = (orderID) => request.get(`/orders/${orderID}`)

const getCustomerBaseOnConversation = id => request.get(`/messenger/conversations/${id}`)

const getClinicBranches = () => request.get('branches')

const getCustomerSources = () => request.get(`/customer-sources`)

const getCustomerBaseOnID = (cutomerID) => request.get(`customers/${cutomerID}`)

const getProductsToOrder = (params) => request.get(`/products?${querystring.stringify({ ...params })}`)

const createOrder = (params) => request.post('/orders', params)

const updateOrder = (orderID, params) => request.put(`/orders/${orderID}`, params)

const deleteOrder = (orderID, params) => request.delete(`/orders/${orderID}?${querystring.stringify({ ...params })}`)

export default {
  getProductsToOrder,
  getCustomerBaseOnPhone,
  getOrder,
  getCustomerBaseOnConversation,
  getClinicBranches,
  getCustomerSources,
  getCustomerBaseOnID,
  createOrder,
  updateOrder,
  deleteOrder,
}
