import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import WatchVideo from "./containers/WatchVideo";
import MyVideos from "./containers/MyVideos";
import NewVideo from "./containers/NewVideo";
import EditVideo from "./containers/EditVideo";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={ Home } />
      <UnauthenticatedRoute exact path="/login" component={ Login } />
      <UnauthenticatedRoute exact path="/signup" component={ Signup } />
      <AuthenticatedRoute exact path="/users/one/videos/:id" component={ WatchVideo } />
      <AuthenticatedRoute exact path="/users/me/videos" component={ MyVideos } />
      <AuthenticatedRoute exact path="/users/me/videos/new" component={ NewVideo } />
      <AuthenticatedRoute exact path="/users/me/videos/:id" component={ EditVideo } />

      {/* Finally, catch all unmatched routes */}
      <Route component={ NotFound } />
    </Switch>
  );
}