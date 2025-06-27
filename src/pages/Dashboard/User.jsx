import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Hooks
import { Authhooks } from "../../hooks/Authhooks";

// Utils
import axiosInst from "../../utils/axios";
import { API_ENDPOINT } from "../../utils/api";
import { validateEmail } from "../../utils/helper";
import { updateImage } from "../../utils/uploadImage";

// Components
import Input from "../../components/Inputs/Input";
import DashboardLayout from "../../components/layout/Dashboard";
import UpdateProfilePhotoSelector from "../../components/Inputs/UpdateProfilePhotoSelector";

// Context
import { UserContext } from "../../context/userContext";

const User = () => {
  Authhooks();

  const { user, updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(user?.profileImageUrl);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if (email) {
      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
    }

    if (password && confirmPassword) {
      if (password != confirmPassword) {
        setError("Please verify the password");
        return;
      }
    }

    setError("");

    try {
      if (profilePic) {
        const imgUpdateRes = await updateImage(profilePic);
        profileImageUrl = imgUpdateRes.imageUrl || "";
      }

      const response = await axiosInst.put(API_ENDPOINT.AUTH.UPDATE_USER, {
        name,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something Went Wrong, Try Again");
      }
    }
  };

  return (
    <DashboardLayout activeMenu={"User"}>
      <div className="my-5 mx-auto">
        <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-black">
            Update My Details
          </h3>

          <form onSubmit={handleUpdate}>
            <UpdateProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={name}
                onChange={({ target }) => setName(target.value)}
                label="Name"
                placeholder={user?.name}
                type="text"
              />
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder={user?.email}
                type="text"
              />
              <div className="col-span-2">
                <Input
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  label="Password"
                  placeholder="Min 8 Characters"
                  type="password"
                />
                <Input
                  value={confirmPassword}
                  onChange={({ target }) => setConfirmPassword(target.value)}
                  label="Confirm Password"
                  placeholder="Password"
                  type="password"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default User;
