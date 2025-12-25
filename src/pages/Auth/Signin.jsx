import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

// Components
import Input from "../../components/Inputs/Input";
import AuthLayout from "../../components/layout/Auth";

// Utils
import axiosInst from "../../utils/axios";
import { API_ENDPOINT } from "../../utils/api";
import { validateEmail } from "../../utils/helper";

// Context
import { UserContext } from "../../context/userContext";

const SignIn = ({ loading, setProgress, setLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    if (!validateEmail(email)) {
      setProgress(100);
      setLoading(false);
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setProgress(100);
      setLoading(false);
      setError("Please enter the password");
      return;
    }

    setError("");
    setProgress(30);

    try {
      const response = await axiosInst.post(API_ENDPOINT.AUTH.SIGNIN, {
        email,
        password,
      });

      setProgress(50);
      const { token, user } = response.data;
      setProgress(80);

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        setProgress(100);
        setLoading(false);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setProgress(100);
        setLoading(false);
        setError(error.response.data.message);
      } else {
        setProgress(100);
        setLoading(false);
        setError("Something Went Wrong, Try Again");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Plese enter your details to signin
        </p>

        <form onSubmit={handleSignin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setpassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button disabled={loading} type="submit" className="btn-primary">
            Sign In
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-primary underline" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
