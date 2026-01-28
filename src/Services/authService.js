/* eslint-disable no-useless-catch */
import axiosInstance from './axiosInstance';
import apisEndPoints from '../Utils/Apis';

export const postSignUp = async (body) => {
  try {
    const response = await axiosInstance.post(apisEndPoints.auth.signUp, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postSignIn = async (body) => {
  try {
    const response = await axiosInstance.post(apisEndPoints.auth.signIn, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putSignOut = async (body) => {
  try {
    const response = await axiosInstance.put(apisEndPoints.auth.signOut, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
