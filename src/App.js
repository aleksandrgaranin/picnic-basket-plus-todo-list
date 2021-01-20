import React, { useEffect, Suspense } from "react";
import Layout from "./hoc/Layout/Layout";

import Logout from "./containers/Auth/Logout/Logout";
import Spinner from "./components/UI/Spinner/Spinner";

import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";

const Auth = React.lazy(() => {
  return import("./containers/Auth/Auth");
});

const BasketList = React.lazy(() => {
  return import("./containers/BasketList/BasketList");
});

const PurchasedItems = React.lazy(() => {
  return import("./components/Basket/PurchasedItems/PurchasedItems");
});

const AddItems = React.lazy(() => {
  return import("./components/Basket/AddItem/AddItemModal/AddItemModal");
});

const Todo = React.lazy(() => {
  return import("./containers/Todo/Todo");
});

const Notes = React.lazy(() => {
  return import("./containers/Notes/Notes");
});

const NewPost = React.lazy(() => {
    return import("./components/Notes/NewPost/NewPost");
  });

const App = (props) => {
  const { onTryAutoSignup } = props;
  useEffect(() => {
    onTryAutoSignup();
  }, [onTryAutoSignup]);

  let routes = (
    <Switch>
      <Route path="/auth" render={(props) => <Auth {...props} />} />
      <Redirect to="/auth" />
    </Switch>
  );

  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/logout" component={Logout} />
        <Route path="/auth" render={(props) => <Auth {...props} />} />
        <Route
          path="/purchased"
          render={(props) => <PurchasedItems {...props} />}
        />
        <Route path="/add" render={(props) => <AddItems {...props} />} />
        <Route path="/todo" render={(props) => <Todo {...props} />} />
        <Route path="/posts" render={(props) => <Notes {...props} />} />
        <Route path="/new-post" render={(props) => <NewPost {...props} />} />
        <Route path="/" exact component={BasketList} />
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <Layout>
        <Suspense fallback={<Spinner />}>{routes}</Suspense>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
