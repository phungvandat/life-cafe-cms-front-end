import React from 'react'
import PropTypes from 'prop-types'
import './spinners.scss'

function Spinners({
  wave,
  rotatingPlane,
  doubleBounce,
  wanderingCubes,
  pulse,
  chasingDots,
  threeBounce,
  circle,
  cubeGrid,
  fadingCircle,
  foldingCube,
}) {
  if (wave) {
    return (
      <div className="sk-wave">
        <div className="sk-rect sk-rect1" />
        &nbsp;
        <div className="sk-rect sk-rect2" />
        &nbsp;
        <div className="sk-rect sk-rect3" />
        &nbsp;
        <div className="sk-rect sk-rect4" />
        &nbsp;
        <div className="sk-rect sk-rect5" />
      </div>
    )
  }
  if (rotatingPlane) {
    return <div className="sk-rotating-plane" />
  }
  if (doubleBounce) {
    return (
      <div className="sk-double-bounce">
        <div className="sk-child sk-double-bounce1" />
        <div className="sk-child sk-double-bounce2" />
      </div>
    )
  }
  if (wanderingCubes) {
    return (
      <div className="sk-wandering-cubes">
        <div className="sk-cube sk-cube1" />
        <div className="sk-cube sk-cube2" />
      </div>
    )
  }
  if (pulse) {
    return <div className="sk-spinner sk-spinner-pulse" />
  }
  if (chasingDots) {
    return (
      <div className="sk-chasing-dots">
        <div className="sk-child sk-dot1" />
        <div className="sk-child sk-dot2" />
      </div>
    )
  }
  if (threeBounce) {
    return (
      <div className="sk-three-bounce">
        <div className="sk-child sk-bounce1" />
        <div className="sk-child sk-bounce2" />
        <div className="sk-child sk-bounce3" />
      </div>
    )
  }
  if (circle) {
    return (
      <div className="sk-circle">
        <div className="sk-circle1 sk-child" />
        <div className="sk-circle2 sk-child" />
        <div className="sk-circle3 sk-child" />
        <div className="sk-circle4 sk-child" />
        <div className="sk-circle5 sk-child" />
        <div className="sk-circle6 sk-child" />
        <div className="sk-circle7 sk-child" />
        <div className="sk-circle8 sk-child" />
        <div className="sk-circle9 sk-child" />
        <div className="sk-circle10 sk-child" />
        <div className="sk-circle11 sk-child" />
        <div className="sk-circle12 sk-child" />
      </div>
    )
  }
  if (cubeGrid) {
    return (
      <div className="sk-cube-grid">
        <div className="sk-cube sk-cube1" />
        <div className="sk-cube sk-cube2" />
        <div className="sk-cube sk-cube3" />
        <div className="sk-cube sk-cube4" />
        <div className="sk-cube sk-cube5" />
        <div className="sk-cube sk-cube6" />
        <div className="sk-cube sk-cube7" />
        <div className="sk-cube sk-cube8" />
        <div className="sk-cube sk-cube9" />
      </div>
    )
  }
  if (fadingCircle) {
    return (
      <div className="sk-fading-circle">
        <div className="sk-circle1 sk-circle" />
        <div className="sk-circle2 sk-circle" />
        <div className="sk-circle3 sk-circle" />
        <div className="sk-circle4 sk-circle" />
        <div className="sk-circle5 sk-circle" />
        <div className="sk-circle6 sk-circle" />
        <div className="sk-circle7 sk-circle" />
        <div className="sk-circle8 sk-circle" />
        <div className="sk-circle9 sk-circle" />
        <div className="sk-circle10 sk-circle" />
        <div className="sk-circle11 sk-circle" />
        <div className="sk-circle12 sk-circle" />
      </div>
    )
  }
  if (foldingCube) {
    return (
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube" />
        <div className="sk-cube2 sk-cube" />
        <div className="sk-cube4 sk-cube" />
        <div className="sk-cube3 sk-cube" />
      </div>
    )
  }
  return null
}

Spinners.propTypes = {
  wave: PropTypes.bool,
  rotatingPlane: PropTypes.bool,
  doubleBounce: PropTypes.bool,
  wanderingCubes: PropTypes.bool,
  pulse: PropTypes.bool,
  chasingDots: PropTypes.bool,
  threeBounce: PropTypes.bool,
  circle: PropTypes.bool,
  cubeGrid: PropTypes.bool,
  fadingCircle: PropTypes.bool,
  foldingCube: PropTypes.bool,
}

export default Spinners
