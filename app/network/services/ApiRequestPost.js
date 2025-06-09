import {ApiPostServiceWrapper , ApiPatchServiceWrapper } from "../wrapperService";
import { API_ENDPOINT } from "./ApiEndPoint";

export const ApiRequestPost = {
  createUserData: (formData) => {
    return new Promise((resolve, reject) => {
      ApiPostServiceWrapper({
        url: `${API_ENDPOINT.basePath}users`,
        headers: {},
        body: formData,
      })
        .then(resolve)
        .catch(reject);
    });
  },

  updateUserData: (id, formData) => {
    return new Promise((resolve, reject) => {
      ApiPatchServiceWrapper({
        url: `${API_ENDPOINT.basePath}users/${id}`,
        headers: {},
        body: formData,
      })
        .then(resolve)
        .catch(reject);
    });
  },
};
