import { request } from '../../configures/axios'

export const updateCustomer = (customerID, params) => (
  request.put(`customers/${customerID}`, params)
)