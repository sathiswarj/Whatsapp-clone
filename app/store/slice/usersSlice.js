import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData, addUserData, fetchUserChats } from '@/store/actions/userActions';

const initialState = {
  id: '',
  name: '',
  image: '',
  loading: false,
  error: null,
  chats: [],
  unreadCount: 0,
    focusedChatId: null,

};

const usersSlice = createSlice({
  name: 'user',
  initialState,
 reducers: {
  setName: (state, action) => {
    state.name = action.payload;
  },
  setImage: (state, action) => {
    state.image = action.payload;
  },
    setFocusedChatId: (state, action) => {
    state.focusedChatId = action.payload;
  },
  setUser: (state, action) => {
  state.id = action.payload;
},

  updateChatList: (state, action) => {
    const updatedChat = action.payload;
    const existingIndex = state.chats.findIndex(chat => chat._id === updatedChat._id);

    if (existingIndex !== -1) {
      state.chats[existingIndex] = updatedChat;
    } else {
      state.chats.unshift(updatedChat); // Add to top if it's a new chat
    }

 

  },
 clearUnreadCount: (state, action) => {
  const { chatId, userId } = action.payload;

  state.chats = state.chats.map(chat => {
    if (chat._id === chatId && chat.unreadCounts) {
      return {
        ...chat,
        unreadCounts: {
          ...chat.unreadCounts,
          [userId]: 0,
        },
      };
    }
    return chat;
  });

  state.unreadCount = state.chats.reduce((total, chat) => {
    const count = chat.unreadCounts?.[userId] || 0;
    return total + count;
  }, 0);
}

},
  extraReducers: (builder) => {
    // fetchUserData
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        state.id = user.id;
        state.name = user.name || '';
        state.image = user.profileImg || '';
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // addUserData
    builder
      .addCase(addUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserData.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload;
        state.id = user.id;
        state.name = user.name || '';
        state.image = user.profileImg || '';
      })
      .addCase(addUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchUserChats
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload.chats;
        state.unreadCount = action.payload.unreadCount;
      })

      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setName, setImage, setUserId  ,updateChatList, setFocusedChatId,clearUnreadCount } = usersSlice.actions;
export default usersSlice.reducer;
