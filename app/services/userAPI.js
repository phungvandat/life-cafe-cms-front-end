import { request } from '../configures/axios'

const signIn = params => request.post('users/log-in', params)

export default { signIn }
