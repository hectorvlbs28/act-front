import axiosInstance from './axiosInstance';
import apisEndPoints from '../Utils/Apis';

export const postSignUp = async (body) => {
  const response = await axiosInstance.post(apisEndPoints.auth.signUp, body);
  return response.data;
};

export const postSignIn = async (body) => {
  const response = await axiosInstance.post(apisEndPoints.auth.signIn, body);
  return response.data;
};

export const putSignOut = async () => {
  const response = await axiosInstance.put(apisEndPoints.auth.signOut);
  return response.data;
};
