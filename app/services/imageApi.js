import { request } from '../configures/axios'
import configs from '../configures/configs'

async function uploadImages(files) {
  try {
    const formData = new FormData() //eslint-disable-line
    files.forEach((file) => {
      formData.append('images', file)
    })
    const { links } = await request.post('upload/images', formData)
    return links.map(photo => `${configs.SERVER_URL}/${photo}`)
  } catch (error) {
    throw error.response || error
  }
}

export default {
  uploadImages,
}