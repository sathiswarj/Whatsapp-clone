// store/actions/userActions.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiRequestGet } from '@/network/services/ApiRequestGet';
import { ApiRequestPost } from '@/network/services/ApiRequestPost';

import {
  setName,
  setImage,
  USER_DATA_LOADING,
  USER_DATA_SUCCESS,
  USER_DATA_ERROR,
  USER_ADD_LOADING,
  USER_ADD_SUCCESS,
  USER_ADD_ERROR,
  USER_CHATS_LOADING,
  USER_CHATS_SUCCESS,
  USER_CHATS_ERROR,
} from '@/store/slice/usersSlice'


export const fetchUserData = (phoneNumber) => async (dispatch) => {
  try {
    dispatch(USER_DATA_LOADING());
    const response = await ApiRequestGet.getUserData(phoneNumber);
    const user = response?.user;

    if (user) {
      dispatch(USER_DATA_SUCCESS(user));
    } else {
      dispatch(USER_DATA_ERROR('No user found'));
    }
  } catch (error) {
    dispatch(USER_DATA_ERROR('Failed to fetch'));
  }
};

export const addUserData = ({ name, phoneNumber, image, id }) => async (dispatch) => {
  try {
    dispatch(USER_ADD_LOADING());

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phoneNumber);

    if (image && image.startsWith('file://')) {
      formData.append('profile', {
        uri: image,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }

    const response = id
      ? await ApiRequestPost.updateUserData(id, formData)
      : await ApiRequestPost.createUserData(formData);

    const userData = response?.user || response?.data?.user;

    if (userData) {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      dispatch(USER_ADD_SUCCESS(userData));
    } else {
      dispatch(USER_ADD_ERROR('No user data returned'));
    }
  } catch (error) {
    dispatch(USER_ADD_ERROR('Network error or invalid response'));
  }
};

 
export const fetchUserChats = (userId) => async (dispatch) => {
  try {
    dispatch(USER_CHATS_LOADING());

    const response = await ApiRequestGet.getAllChats(userId);

    if (response?.chats) {
      dispatch(USER_CHATS_SUCCESS(response.chats));
    } else if (Array.isArray(response)) {
      dispatch(USER_CHATS_SUCCESS(response));
    } else {
      dispatch(USER_CHATS_ERROR('Unexpected response format'));
    }
  } catch (error) {
    console.error('Failed to fetch chats:', error);
    dispatch(USER_CHATS_ERROR('Failed to fetch user chats'));
  }
};

 export { setImage, setName };
