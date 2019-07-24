/**
*
* TextEditor
*
*/

import React from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import tinymce from 'tinymce/tinymce'
import ImageActions from '../../redux/imageRedux'
import './text-editor.scss'

class TextEditor extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.setContent = this.setContent.bind(this)
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  handleChange(e) {
    this.props.onChange(e.target.getContent())
  }

  setContent(value) {
    tinymce.get(this.props.id).setContent(value)
  }

  render() {
    const { uploadImages } = this.props
    return (
      <div>
        <Editor
          id={this.props.id}
          baseURL="/static"
          initialValue={this.props.value}
          onChange={this.handleChange}
          init={{
            plugins: [
              'advlist autolink lists link image charmap print preview anchor textcolor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table contextmenu paste code help wordcount',
            ],
            toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image',
            height: 500,
            images_upload_handler: (source, success) => {
              const fd = new FormData()
              fd.append('images', source.blob())
              uploadImages(fd, links => success(links))
            },
          }}
        />
      </div>
    )
  }
}

TextEditor.propTypes = {
  id: PropTypes.string,
  onRef: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  uploadImages: PropTypes.func,
}

const mapStateToProps = () => ({})

const mapDispatchToProps = dispatch => ({
  uploadImages: (files, actionSuccess) =>
    dispatch(ImageActions.uploadImagesRequest(files, actionSuccess)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TextEditor)
