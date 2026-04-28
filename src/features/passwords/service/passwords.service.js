import axiosInstance from "../../../lib/axios/axiosInstance";
import apisEndPoints from "../../../shared/constants/apis";

export const getAllPaswords = async () => {
  const response = await axiosInstance.get(apisEndPoints.passwords.getAllPaswords);
  return response.data;
};

export const getPasswordValueById = async (id) => {
  const response = await axiosInstance.get(
    apisEndPoints.passwords.getValue.replace(":id", id)
  );
  return response.data;
};

export const createNewPassword = async (body) => {
  const response = await axiosInstance.post(apisEndPoints.passwords.createNew, body);
  return response.data;
};

export const deletePasswordValueById = async (id) => {
  const response = await axiosInstance.put(
    apisEndPoints.passwords.deleteValue.replace(":id", id)
  );
  return response.data;
};

export const updatePassword = async (id, body) => {
  const response = await axiosInstance.put(
    apisEndPoints.passwords.update.replace(":id", id),
    body
  );
  return response.data;
};
