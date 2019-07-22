/* eslint-disable no-nested-ternary */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './upload-image.scss'

class UploadImage extends Component {
  static propTypes = {
    image: PropTypes.string,
    onChange: PropTypes.func,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onRef: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      imagePreview: '',
      selectedFile: '',
    }
  }

  componentDidMount() {
    const { onRef } = this.props
    if (onRef) {
      onRef(this)
    }
  }

  resetForm() {
    this.setState({
      imagePreview: '',
      selectedFile: '',
    }, () => { this.uploadFile.value = '' })
  }

  handleOnChange = (event) => {
    const { target } = event
    const { name, onChange } = this.props
    const { files } = target
    this.setState(
      {
        selectedFile: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      },
      () => {
        const data = {}
        data.target = {
          type: 'file',
          name,
          value: this.state.selectedFile,
        }
        onChange(data)
      },
    )
  };

  render() {
    const { imagePreview, selectedFile } = this.state
    const {
      image, rounded, disabled, name, onChange,
    } = this.props
    return (
      <div
        className={`upload-image ${
          imagePreview ? 'upload-image--animation' : ''
        }`}
        style={rounded ? { width: '100%' } : {}}
      >
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            this.uploadFile.click()
          }}
          className="upload-image__upload"
          style={rounded ? { width: '100%' } : {}}
        >
          {imagePreview || image ? (
            <div className="upload-image__image-wrapper">
              <img
                className="upload-image__image"
                src={imagePreview || image}
                alt="imageUpload"
                style={rounded ? { borderRadius: '55%' } : {}}
              />
            </div>
          ) : (
            <div
              style={rounded ? { borderRadius: '55%' } : {}}
              className="upload-image__no-image"
            >
              <i className="fa fa-picture-o" />
            </div>
          )}
        </button>
        {rounded ? (
          imagePreview || selectedFile ? (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this.setState({ selectedFile: '', imagePreview: '' }, () => {
                  const data = {}
                  data.target = {
                    type: 'file',
                    name,
                    value: this.state.selectedFile,
                  }
                  onChange(data)
                })
              }}
              className="upload-image__ease-img--rounded"
            >
              <i className="fa fa-times" />
            </button>
          ) : null
        ) : imagePreview || selectedFile ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              this.setState({ selectedFile: '', imagePreview: '' }, () => {
                this.uploadFile.value = ''
                const data = {}
                data.target = {
                  type: 'file',
                  name,
                  value: this.state.selectedFile,
                }
                onChange(data)
              })
            }}
            className="upload-image__ease-img"
          >
            <i className="fa fa-times" />
          </button>
        ) : null}
        <input
          type="file"
          ref={(input) => {
            this.uploadFile = input
          }}
          onChange={this.handleOnChange}
          style={{ display: 'none' }}
          name="selectedFile"
          disabled={disabled}
        />
      </div>
    )
  }
}

UploadImage.propTypes = {}

export default UploadImage
