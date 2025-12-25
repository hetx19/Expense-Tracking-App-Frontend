import React from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/signin" exact element={<SignIn />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} />
            <Route path="/user" exact element={<User />} />
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
