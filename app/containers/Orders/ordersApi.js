import querystring from 'querystring'
import { request } from '../../configures/axios'

function getOrders(params) {
  return request.get(`/orders?${querystring.stringify({ ...params })}`)
}

export {
  getOrders,
}
