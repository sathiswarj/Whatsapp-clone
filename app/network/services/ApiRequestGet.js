import { ApiGetServiceWrapper } from "../wrapperService";
import { API_ENDPOINT } from "./ApiEndPoint";

export const ApiRequestGet = {
  getUserData: async (phoneNumber) => {
    try {
      return await ApiGetServiceWrapper({
        url: `${API_ENDPOINT.basePath}users/${phoneNumber}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error(error.message || 'Failed to fetch user data');
    }
  },
  getAllChats: async (userId) => {
    try {
      return await ApiGetServiceWrapper({
        url: `${API_ENDPOINT.basePath}conversation/${userId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error(error.message || 'Failed to fetch user data');
    }
  }

}