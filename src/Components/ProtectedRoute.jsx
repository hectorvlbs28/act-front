import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Links from "../Utils/Links";
import { selectIsLogged } from "../Redux/user.Slice";

const ProtectedRoute = () => {
  const navigate = useNavigate();

  const USER_LOGGED = useSelector(selectIsLogged);

  useEffect(() => {
    if (!USER_LOGGED) {
      navigate(Links.home);
    }
  }, [USER_LOGGED, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
