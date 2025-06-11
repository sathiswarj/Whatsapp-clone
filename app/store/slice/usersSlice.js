// store/slice/usersSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  image: '',
  loading: false,
  error: null,
  chats: [],
};

export const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setImage: (state, action) => {
      state.image = action.payload;
    },

    USER_DATA_LOADING: (state) => {
      state.loading = true;
      state.error = null;
    },
    USER_DATA_SUCCESS: (state, action) => {
      state.loading = false;
      const user = action.payload;
      state.id = user.id;
      state.name = user.name || '';
      state.image = user.profileImg || '';
    },
    USER_DATA_ERROR: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    USER_ADD_LOADING: (state) => {
      state.loading = true;
      state.error = null;
    },
    USER_ADD_SUCCESS: (state, action) => {
      state.loading = false;
      const user = action.payload;
      state.id = user.id;
      state.name = user.name || '';
      state.image = user.profileImg || '';
    },
    USER_ADD_ERROR: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    USER_CHATS_LOADING: (state) => {
      state.loading = true;
      state.error = null;
    },
    USER_CHATS_SUCCESS: (state, action) => {
      state.loading = false;
      state.chats = action.payload;
    },
    USER_CHATS_ERROR: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
} = usersSlice.actions;

export default usersSlice.reducer;
