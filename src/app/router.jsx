import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

import AppTheme from './theme/AppTheme';
import AppAppBar from '../shared/components/AppBar/AppAppBar';
import Loading from '../shared/components/ui/Loading';
import TokenExpirationChecker from '../shared/components/ui/TokenExpirationChecker';
import SignInProtect from '../shared/components/ui/SignInProtect';
import ProtectedRoute from '../shared/components/ui/ProtectedRoute';
import axiosInstance from '../lib/axios/axiosInstance';
import Links from '../shared/constants/links';
import { selectIsLogged, selectUserToken } from '../features/auth/store/auth.slice';
import { setApiLoading } from '../store/navigation.slice';
import useToast from '../Hooks/useToast';

const Home = lazy(() => import('../features/home/Home'));
const SignIn = lazy(() => import('../features/auth/SignIn'));
const SignUp = lazy(() => import('../features/auth/SignUp'));
const Passwords = lazy(() => import('../features/passwords/Passwords'));

const App = () => {
  const dispatch = useDispatch();
  const { toastError } = useToast();
  const USER_LOGGED = useSelector(selectIsLogged);
  const USER_TOKEN = useSelector(selectUserToken);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        dispatch(setApiLoading({ status: true }));
        if (USER_LOGGED && USER_TOKEN) {
          config.headers.Authorization = `Bearer ${USER_TOKEN}`;
        }
        return config;
      },
      (error) => {
        dispatch(setApiLoading({ status: false }));
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        dispatch(setApiLoading({ status: false }));
        if (response.data?.message) {
          toast.success(response.data.message);
        } else if (response.status >= 200 && response.status < 300) {
          toast.success('Operación realizada con éxito.');
        }
        return response;
      },
      (error) => {
        dispatch(setApiLoading({ status: false }));

        if (error.response) {
          toastError(
            error.response.data?.message || 'Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.'
          );
        } else if (error.request) {
          toastError('No se pudo conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
        } else {
          console.error('Error:', error.message);
          toastError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [USER_LOGGED, USER_TOKEN, dispatch]);

  return (
    <AppTheme>
      <Toaster />
      <Loading />
      <Router>
        {USER_LOGGED ? <TokenExpirationChecker /> : null}
        <CssBaseline enableColorScheme />
        <AppAppBar />

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path={Links.home} element={<Home />} />

            <Route element={<SignInProtect />}>
              <Route path={Links.signIn} element={<SignIn />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path={Links.passwords} element={<Passwords />} />
              <Route path={Links.SignUp} element={<SignUp />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AppTheme>
  );
};

export default App;
