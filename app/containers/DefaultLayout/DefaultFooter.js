import React, { Component } from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  children: PropTypes.node,
}

const defaultProps = {}

/* eslint-disable react/prefer-stateless-function */
class DefaultFooter extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span>
          <a href="/">LIFE CAFE CMS</a>
          {' '}
          &copy;2019 Life cafe
        </span>
      </React.Fragment>
    )
  }
}

DefaultFooter.propTypes = propTypes
DefaultFooter.defaultProps = defaultProps

export default DefaultFooter
