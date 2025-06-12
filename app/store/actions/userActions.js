// store/actions/userActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiRequestGet } from '@/network/services/ApiRequestGet';
import { ApiRequestPost } from '@/network/services/ApiRequestPost';
import { setImage, setName } from '@/store/slice/usersSlice';

// Fetch user data
export const fetchUserData = createAsyncThunk(
  'users/fetchUserData',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const response = await ApiRequestGet.getUserData(phoneNumber);
      const user = response?.user;

      if (user) {
        return user;
      } else {
        return rejectWithValue('No user found');
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch');
    }
  }
);

 export const addUserData = createAsyncThunk(
  'users/addUserData',
  async ({ name, phoneNumber, image, id }: { name: string; phoneNumber: string; image?: string; id?: string }, { rejectWithValue }) => {
    try {
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
        return userData;
      } else {
        return rejectWithValue('No user data returned');
      }
    } catch (error) {
      return rejectWithValue('Network error or invalid response');
    }
  }
);

// Fetch user chats
export const fetchUserChats = createAsyncThunk(
  'users/fetchUserChats',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await ApiRequestGet.getAllChats(userId);

      const chats = response?.chats || (Array.isArray(response) ? response : null);

      if (!chats) {
        return rejectWithValue('Unexpected response format');
      }

      // Compute total unread count for current user
      const unreadCount = chats.reduce((total, chat) => {
        const count = chat.unreadCounts?.[userId] || 0;
        return total + count;
      }, 0);

      return { chats, unreadCount };
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      return rejectWithValue('Failed to fetch user chats');
    }
  }
);


export { setImage, setName };
