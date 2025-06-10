import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiRequestGet } from '@/network/services/ApiRequestGet';
import { ApiRequestPost } from '@/network/services/ApiRequestPost';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Fetch user by phone number
export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (phoneNumber, thunkAPI) => {
    try {
      const response = await ApiRequestGet.getUserData(phoneNumber);
      return response?.user;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch');
    }
  }
);

// ✅ Add or update user
export const addUserData = createAsyncThunk(
  'user/addUserData',
  async (
    { name, phoneNumber, image, id } 
     
  ) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phoneNumber);

      if (image && image.startsWith('file://')) {
        formData.append('profile', {
          uri: image,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } );
      }

      let response;

      if (id) {
        response = await ApiRequestPost.updateUserData(id, formData);
      } else {
        response = await ApiRequestPost.createUserData(formData);
      }

      const userData = response?.user || response?.data?.user;
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        return thunkAPI.rejectWithValue('No user data returned');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Network error or invalid response');
    }
  }
);

const usersSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    name: '',
    image: '',
    loading: false,
    error: null,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        if (user) {
          state.id = user.id;
          state.name = user.name || '';
          state.image = user.profileImg || '';
        }
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
         .addCase(addUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUserData.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});




export const { setName, setImage } = usersSlice.actions;
export default usersSlice.reducer;
