import React from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

// Pages
import SignIn from "./pages/Auth/Signin";
import SignUp from "./pages/Auth/Signup";
import Home from "./pages/Dashboard/Home";
import User from "./pages/Dashboard/User";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";

// Context Api
import UserProvider from "./context/userContext";

const App = () => {
  const [progress, setProgress] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  return (
    <UserProvider>
      <div>
        <LoadingBar
          height={3}
          progress={progress}
          color="#875cf5"
          onLoaderFinished={() => setProgress(0)}
        />
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route
              path="/signin"
              exact
              element={
                <SignIn
                  loading={loading}
                  setProgress={setProgress}
                  setLoading={setLoading}
                />
              }
            />
            <Route
              path="/signup"
              exact
              element={
                <SignUp
                  loading={loading}
                  setLoading={setLoading}
                  setProgress={setProgress}
                />
              }
            />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route
              path="/user"
              exact
              element={
                <User
                  loading={loading}
                  setLoading={setLoading}
                  setProgress={setProgress}
                />
              }
            />
          </Routes>
        </Router>
      </div>

      <Toaster toastOptions={{ className: "", style: { fontSize: "13px" } }} />
    </UserProvider>
  );
};

const Root = () => {
  const is_Authenticated = !!localStorage.getItem("token");

  return is_Authenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/signin" />
  );
};

export default App;
