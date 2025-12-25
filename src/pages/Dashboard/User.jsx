import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Hooks
import { Authhooks } from "../../hooks/Authhooks";

// Utils
import axiosInst from "../../utils/axios";
import { API_ENDPOINT } from "../../utils/api";
import { validateEmail } from "../../utils/helper";
import { updateImage } from "../../utils/uploadImage";

// Components
import Modal from "../../components/Modal";
import Input from "../../components/Inputs/Input";
import DeleteAlert from "../../components/DeleteAlert";
import DashboardLayout from "../../components/layout/Dashboard";
import UpdateProfilePhotoSelector from "../../components/Inputs/UpdateProfilePhotoSelector";

// Context
import { UserContext } from "../../context/userContext";

const User = ({ loading, setLoading, setProgress }) => {
  Authhooks();

  const { user, updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(user?.profileImageUrl);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    if (email && !validateEmail(email)) {
      setProgress(100);
      setLoading(false);
      return setError("Please enter a valid email address");
    }

    if ((password || confirmPassword) && password !== confirmPassword) {
      setProgress(100);
      setLoading(false);
      return setError("Passwords do not match");
    }

    setError(null);

    let profileImageUrl = user?.profileImageUrl || "";
    setProgress(30);

    try {
      if (profilePic && profilePic !== user?.profileImageUrl) {
        const imgUpdateRes = await updateImage(profilePic);
        profileImageUrl = imgUpdateRes.imageUrl || "";
      }

      const payload = {};
      if (name && name !== user?.name) payload.name = name;
      if (email && email !== user?.email) payload.email = email;
      if (password) payload.password = password;
      if (profileImageUrl && profileImageUrl !== user?.profileImageUrl) {
        payload.profileImageUrl = profileImageUrl;
      }

      setProgress(50);
      const response = await axiosInst.put(
        API_ENDPOINT.AUTH.UPDATE_USER,
        payload
      );
      const { token, user: updatedUser } = response.data;
      setProgress(80);

      if (token) {
        localStorage.setItem("token", token);
        updateUser(updatedUser);
        setProgress(100);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User details updated successfully.");
      }
    } catch (error) {
      if (error.response?.data?.message) {
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

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    try {
      setProgress(30);
      await axiosInst.delete(API_ENDPOINT.AUTH.DELETE_USER);
      setProgress(60);

      localStorage.removeItem("token");
      updateUser(null);
      setProgress(100);
      setLoading(false);
      navigate("/signin");
      toast.success("User deleted successfully.");
    } catch (error) {
      if (error.response?.data?.message) {
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

            <div className="flex gap-2">
              <button disabled={loading} type="submit" className="btn-primary">
                Update Details
              </button>
              <button
                disabled={loading}
                type="button"
                onClick={() => setOpenDeleteAlert(true)}
                className="btn-secondary"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
        <Modal
          isOpen={openDeleteAlert}
          onClose={() => setOpenDeleteAlert(false)}
          title="Delete Account"
        >
          <DeleteAlert
            content="Are you sure you want to delete this account details?"
            onDelete={handleDelete}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default User;
