import querystring from 'querystring'
import {request} from '../../configures/axios'

function getCustomers(params){
  return request.get(`/users?${querystring.stringify({...params})}`)
}

export {
  getCustomers,
}