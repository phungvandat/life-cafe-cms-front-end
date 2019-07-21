import React, { Suspense, Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container } from 'reactstrap'
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react'
import 'utils/appSidebarNav'

import Spinners from 'components/Spinners'

import navigation from '../../_navs'
import routes from '../../_routes'

const DefaultAside = React.lazy(() => import('./DefaultAside'))
const DefaultFooter = React.lazy(() => import('./DefaultFooter'))
const DefaultHeader = React.lazy(() => import('./DefaultHeader'))

/* eslint-disable react/prefer-stateless-function */
export class DefaultLayout extends Component {

  handleRedirect = () => {
    const redirectTo = '/dashboard'
    return redirectTo
  }

  render() {
    const { warning, user } = this.props
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={<Spinners pulse />}>
            <DefaultHeader
              warning={warning}
            />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense fallback={<Spinners pulse />}>
              <AppSidebarNav
                warning={warning}
                navConfig={navigation}
                {...this.props}
              />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <Container fluid>
              <Suspense fallback={<Spinners pulse />}>
                <Switch>
                  {routes.map(
                    (route, index) =>
                      route.component && route.rolesAccess.includes(user.role) ? (
                        <Route
                          key={route.key || index}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => <route.component {...props} />}
                        />
                      ) : null,
                  )}
                  <Redirect
                    exact from="/"
                    to={this.handleRedirect()}
                  />
                  <Redirect to="/404" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={<Spinners pulse />}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={<Spinners pulse />}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    )
  }
}

DefaultLayout.propTypes = {
  user: PropTypes.object,
  state: PropTypes.object,
  warning: PropTypes.func,
}

const mapStateToProps = state => ({
  state,
  user: state.user.get('user').toJS(),
  token: state.user.get('user') ? state.user.get('user').get('token') : '',
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout)
