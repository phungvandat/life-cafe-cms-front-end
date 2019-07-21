import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LaddaButton, { EXPAND_LEFT, XL } from 'react-ladda'

/* eslint-disable react/prefer-stateless-function */
class LoadingButton extends Component {
  render() {
    const { children, loading, onClick, color, className, dataSpinnerColor, disabled } = this.props
    return (
      <LaddaButton
        className={`btn btn-${color} btn-ladda ${className}`}
        loading={loading}
        onClick={onClick}
        data-size={XL}
        data-style={EXPAND_LEFT}
        data-spinner-color={dataSpinnerColor}
        disabled={disabled}
      >
        {children}
      </LaddaButton>
    )
  }
}
LoadingButton.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  className: PropTypes.string,
  dataSpinnerColor: PropTypes.string,
  disabled: PropTypes.bool,
}

export default LoadingButton
