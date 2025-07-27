import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";

// Utils
import axiosInst from "../utils/axios";
import { API_ENDPOINT } from "../utils/api";

// Context
import { UserContext } from "../context/userContext";

export const Authhooks = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      return;
    }

    let userIsMounted = true;

    const fetchUser = async () => {
      try {
        const responce = await axiosInst.get(API_ENDPOINT.AUTH.GET_USER);

        if (userIsMounted && responce.data) {
          updateUser(responce.data);
        }
      } catch (error) {
        console.error("Failed To Fetch User Info: ", error);
        if (userIsMounted) {
          clearUser();
          navigate("/signin");
        }
      }
    };

    fetchUser();

    return () => {
      userIsMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateUser, clearUser, navigate]);
};
