import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

import AppTheme from "../Theme/AppTheme";
import AppAppBar from "../Components/Generals/AppAppBar";
import Links from "../Utils/Links";
import Loading from "../Components/Loading";
import TokenExpirationChecker from "../Components/TokenExpirationChecker";
import SignInProtect from "../Components/SignInProtect";
import axiosInstance from "../Services/axiosInstance";
import ProtectedRoute from "../Components/ProtectedRoute";
import { selectIsLogged, selectUserToken } from "../Redux/user.Slice";
import { setApiLoading } from "../Redux/navigation.Slice";

const Home = lazy(() => import("../Views/Home"));
const SignIn = lazy(() => import("../Views/SignIn"));
const Passwords = lazy(() => import("../Views/Passwords"));
const SignUp = lazy(() => import("../Views/SignUp"));

const App = () => {
  const dispatch = useDispatch();

  const USER_LOGGED = useSelector(selectIsLogged);
  const USER_TOKEN = useSelector(selectUserToken);

  const handleToastError = (message) => {
    toast.error(message);
  };

  const handleToastSuccess = (message) => {
    toast.success(message);
  };

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        dispatch(
          setApiLoading({
            status: true,
          })
        );

        if (USER_LOGGED && USER_TOKEN) {
          config.headers.Authorization = `Bearer ${USER_TOKEN}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [USER_LOGGED, USER_TOKEN, dispatch]);

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        dispatch(
          setApiLoading({
            status: false,
          })
        );
        return response;
      },
      (error) => {
        dispatch(
          setApiLoading({
            status: false,
          })
        );
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]);

  return (
    <AppTheme>
      <Toaster />
      <Loading />
      <Router>
        {USER_LOGGED ? (
          <TokenExpirationChecker handleToastError={handleToastError} />
        ) : null}

        <CssBaseline enableColorScheme />

        <AppAppBar handleToastError={handleToastError} />

        <Suspense fallback={<div>Loading...</div>}></Suspense>

        <Routes>
          <Route path={Links.home} element={<Home />} />

          <Route element={<SignInProtect />}>
            <Route
              path={Links.signIn}
              element={
                <SignIn
                  handleToastError={handleToastError}
                  handleToastSuccess={handleToastSuccess}
                />
              }
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path={Links.passwords}
              element={<Passwords handleToastError={handleToastError} />}
            />
            <Route
              path={Links.SignUp}
              element={
                <SignUp
                  handleToastError={handleToastError}
                  handleToastSuccess={handleToastSuccess}
                />
              }
            />
          </Route>
        </Routes>
      </Router>
    </AppTheme>
  );
};

export default App;
