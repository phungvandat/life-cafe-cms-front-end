import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap'
import UserActions from '../../redux/userRedux'

const LoadingButton = React.lazy(() => import('components/LoadingButton'))

class Signin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
    }
  }

  handleSignIn = event => {
    event.preventDefault()
    const { signIn } = this.props
    const { username, password } = this.state
    const data = {
      username,
      password,
    }
    signIn(data)
  };

  handleOnChange = event => {
    const { target } = event
    const { value, name } = target
    this.setState({
      [name]: value,
    })
  };

  render() {
    const { username, password } = this.state
    const { isSigninPending } = this.props
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Sign In</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Username"
                          autoComplete="username"
                          name="username"
                          value={username}
                          onChange={this.handleOnChange}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          name="password"
                          autoComplete="current-password"
                          value={password}
                          onChange={this.handleOnChange}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Suspense fallback={null}>
                            <LoadingButton
                              onClick={this.handleSignIn}
                              color="primary"
                              loading={isSigninPending}
                            >
                              Sign In
                            </LoadingButton>
                          </Suspense>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

Signin.propTypes = {
  signIn: PropTypes.func,
  isSigninPending: PropTypes.bool,
}

const mapStateToProps = state => ({
  isSigninPending: state.user.toJS().isSigninPending,
})

const mapDispatchToProps = dispatch => ({
  signIn: (params, actionSuccess) =>
    dispatch(UserActions.signIn(params, actionSuccess)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signin)
