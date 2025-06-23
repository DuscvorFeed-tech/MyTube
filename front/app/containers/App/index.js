/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';
import LoginPage from 'containers/LoginPage/Loadable';
import RegisterPage from 'containers/RegisterPage/Loadable';
import ForgotPasswordPage from 'containers/ForgotPasswordPage/Loadable';
import Main from 'containers/Main/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import ServerErrorPage from 'containers/ServerErrorPage/Loadable';
import ConfirmEmailPage from 'containers/ConfirmEmailPage/Loadable';
import ConfirmEmailSuccessPage from 'containers/ConfirmEmailPage/subcomponents/Success/Loadable';
import ConfirmEmailFailPage from 'containers/ConfirmEmailPage/subcomponents/Fail/Loadable';
import ConfirmForgotPasswordEmailPage from 'containers/ConfirmForgotPasswordEmailPage/Loadable';
import ChangeForgotPasswordPage from 'containers/ChangeForgotPasswordPage/Loadable';
import ConfirmForgotPasswordEmailFailPage from 'containers/ConfirmForgotPasswordEmailFailPage/Loadable';
import Header from 'components/Header';
import GlobalStyle from '../../global-styles';
import Theme from './Theme';
import QueryString from '../../library/context/querystring';
import UserAccountProvider, {
  UserAccountContext,
} from '../../library/context/userAccount';
import UserSessionProvider, {
  UserSessionContext,
} from '../../library/context/userSession';
import search from './querystring';
import PATH from '../path';
import SchemaProvider, { SchemaContext } from '../../library/context/schema';

// eslint-disable-next-line react/prop-types
// function PrivateRoute({ component: Component, ...rest }) {
//   return (
//     <UserAccountProvider location={rest.location}>
//       <Route
//         {...rest}
//         render={props => (
//           // eslint-disable-next-line react/prop-types
//           <UserAccountContext.Consumer>
//             {({ userAccount }) => {
//               if (userAccount) {
//                 return <Component {...props} userAccount={userAccount} />;
//               }

//               return <Component {...props} />;
//             }}
//           </UserAccountContext.Consumer>
//         )}
//       />
//     </UserAccountProvider>
//   );
// }
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <UserSessionProvider location={rest.location}>
      <Route
        {...rest}
        render={props => (
          // eslint-disable-next-line react/prop-types
          <UserSessionContext.Consumer>
            {({ valid, userAccount }) => {
              if (valid === null) {
                return <LoadingIndicator />;
              }
              return (
                <div>
                  <Header userAccount={userAccount} />
                  <Component {...props} userAccount={userAccount} />
                </div>
              );
            }}
          </UserSessionContext.Consumer>
        )}
      />
    </UserSessionProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={Theme}>
      <SchemaProvider>
        <SchemaContext.Consumer>
          {({ loading, updating }) =>
            loading ? (
              <LoadingIndicator updating={updating} />
            ) : (
              <QueryString.Provider value={search}>
                <React.Fragment>
                  <Switch>
                    <Route exact path={PATH.LOGIN} component={LoginPage} />
                    <Route
                      exact
                      path={PATH.FORGOT_PASSWORD}
                      component={ForgotPasswordPage}
                    />
                    <Route exact path="/register" component={RegisterPage} />
                    <Route path={PATH.PAGE404} component={NotFoundPage} />
                    <Route path={PATH.PAGE500} component={ServerErrorPage} />
                    <Route
                      exact
                      path="/confirm/email/:key/:confirmcode"
                      component={ConfirmEmailPage}
                    />
                    <Route
                      exact
                      path="/register/confirm/fail"
                      component={ConfirmEmailFailPage}
                    />
                    <Route
                      exact
                      path="/register/confirm/success"
                      component={ConfirmEmailSuccessPage}
                    />
                    <Route
                      exact
                      path="/password/forgot/confirmation/:key/:confirmcode"
                      component={ConfirmForgotPasswordEmailPage}
                    />
                    <Route
                      exact
                      path="/forgotpassword/change/:key/:resetcode"
                      component={ChangeForgotPasswordPage}
                    />
                    <Route
                      exact
                      path="/password/forgot/confirmation/fail"
                      component={ConfirmForgotPasswordEmailFailPage}
                    />
                    <PrivateRoute path="/" component={Main} />
                  </Switch>
                  <GlobalStyle />
                </React.Fragment>
              </QueryString.Provider>
            )
          }
        </SchemaContext.Consumer>
      </SchemaProvider>
    </ThemeProvider>
  );
}
