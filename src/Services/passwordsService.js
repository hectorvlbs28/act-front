/* eslint-disable no-useless-catch */
import axiosInstance from "./axiosInstance";
import apisEndPoints from "../Utils/Apis";

export const getAllPaswords = async () => {
  try {
    const response = await axiosInstance.get(
      apisEndPoints.passwords.getAllPaswords
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPasswordValueById = async (id) => {
  try {
    const response = await axiosInstance.get(
      apisEndPoints.passwords.getValue.replace(":id", id)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNewPassword = async (body) => {
  try {
    const response = await axiosInstance.post(
      apisEndPoints.passwords.createNew,
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePasswordValueById = async (id) => {
  try {
    const response = await axiosInstance.put(
      apisEndPoints.passwords.deleteValue.replace(":id", id)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (id, body) => {
  try {
    const response = await axiosInstance.put(
      apisEndPoints.passwords.update.replace(":id", id),
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
