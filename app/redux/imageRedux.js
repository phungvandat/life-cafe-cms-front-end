import { createReducer, createActions } from 'reduxsauce'
import { fromJS } from 'immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loadImagesRequest: ['limit', 'skip', 'q'],
  loadImagesSuccess: ['images', 'hasMore'],

  hideGalleryRequest: null,

  uploadImagesRequest: ['files', 'actionSuccess'],
  uploadImagesSuccess: null,
  uploadImagesFailure: ['error'],

  uploadFilesRequest: ['files', 'actionSuccess'],
  uploadFilesSuccess: null,
  uploadFilesFailure: null,
})

export const ImagesTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = fromJS({
  isLoadingImages: false,
  isUploading: false,
  hasMore: false,
})

/* ------------- Reducers ------------- */

const loadImagesRequest = (state) => (
  state.merge({ isLoadingImages: true })
)

const loadImagesSuccess = (state, { images, hasMore }) => (
  state.merge({ isLoadingImages: false, images, hasMore })
)

const uploadImagesRequest = (state) => state.merge({ isUploading: true })
const uploadImagesSuccess = (state) => state.merge({ isUploading: false })
const uploadImagesFailure = (state) => state.merge({ isUploading: false })

const uploadFilesRequest = (state) => state.merge({ isUploading: true })
const uploadFilesSuccess = (state) => state.merge({ isUploading: false })
const uploadFilesFailure = (state) => state.merge({ isUploading: false })
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOAD_IMAGES_REQUEST]: loadImagesRequest,
  [Types.LOAD_IMAGES_SUCCESS]: loadImagesSuccess,

  [Types.UPLOAD_IMAGES_REQUEST]: uploadImagesRequest,
  [Types.UPLOAD_IMAGES_SUCCESS]: uploadImagesSuccess,
  [Types.UPLOAD_IMAGES_FAILURE]: uploadImagesFailure,

  [Types.UPLOAD_FILES_REQUEST]: uploadFilesRequest,
  [Types.UPLOAD_FILES_SUCCESS]: uploadFilesSuccess,
  [Types.UPLOAD_FILES_FAILURE]: uploadFilesFailure,
})