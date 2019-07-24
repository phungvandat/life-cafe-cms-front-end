import { all, takeLatest, call, put } from 'redux-saga/effects'
import ImagesActions, { ImagesTypes } from '../redux/imageRedux'
import api from '../services/imageApi'
import AppActions from '../redux/appRedux'

export default function* defaultSaga() {
  yield all([
    yield takeLatest(ImagesTypes.LOAD_IMAGES_REQUEST, imagesRequest),
    yield takeLatest(ImagesTypes.UPLOAD_IMAGES_REQUEST, uploadImages),
    yield takeLatest(ImagesTypes.UPLOAD_FILES_REQUEST, uploadFiles),
  ])
}

function* imagesRequest(action) {
  const { limit, skip, q } = action
  try {
    const { images } = yield call(api.getImages, limit, skip, q)
    yield put(ImagesActions.loadImagesSuccess(images, images.length === limit))
  } catch (error) {
    yield put(AppActions.showErrorRequest(error))
  }
}

function* uploadImages(action) {
  const { files, actionSuccess } = action

  try {
    const links = yield call(api.uploadImages, files)
    if (actionSuccess) {
      actionSuccess(links)
    }
    yield put(ImagesActions.uploadImagesSuccess())
  } catch (error) {
    yield put(AppActions.showErrorRequest(error))
    yield put(ImagesActions.uploadImagesFailure())
  }
}

function* uploadFiles(action) {
  const { files, actionSuccess } = action

  try {
    const { links } = yield call(api.uploadFiles, files)
    if (actionSuccess) {
      actionSuccess(links)
    }
    yield put(ImagesActions.uploadFilesSuccess())
  } catch (error) {
    yield put(AppActions.showErrorRequest(error))
    yield put(ImagesActions.uploadFilesFailure())
  }
}