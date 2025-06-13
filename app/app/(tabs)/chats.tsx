import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getUser } from '@/util/storage';
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserChats } from '@/store/actions/userActions';
import type { AppDispatch, RootState } from '@/store/store.ts';
import { getOtherUser } from '@/util/chats';
import { connectSocket, getSocket } from '@/util/socket';
import { updateChatList, setFocusedChatId, clearUnreadCount } from '@/store/slice/usersSlice';
import { ApiRequestPost } from '@/network/services/ApiRequestPost';
import { Alert } from 'react-native';

export default function ChatsScreen() {
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredChats, setFilteredChats] = useState<any[]>([]);
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedChats, setSelectedChats] = useState<any[]>([])
  const [query, setQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { chats, loading, unreadCount } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.push('/');
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const userdata = await getUser();
        if (!userdata || !userdata._id) {
          console.log("No valid user data");
          return;
        }
        setUser(userdata);
        dispatch(fetchUserChats(userdata._id));
      } catch (err) {
        console.log('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    if (!getSocket()?.connected) {
      connectSocket(user._id, () => {
        const socket = getSocket();
        if (!socket) return;

        socket.on("receive-message", ({ message, conversation, isNew }) => {
          dispatch(updateChatList({ ...conversation, currentUserId: user._id }));
        });
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;

    let filtered = Array.isArray(chats) ? [...chats] : [];

    if (activeCategory === "Unread") {
      filtered = filtered.filter(chat => {
        const unreadTotal = Object.values(chat.unreadCounts || {}).reduce((acc: number, val: number) => acc + val, 0);
        return unreadTotal > 0;
      });
    }

   if (query.trim()) {
  filtered = filtered.filter(chat => {
    const other = getOtherUser(chat, user._id);
    const name = other?.name || other?.phone || "";
    return name.toLowerCase().includes(query.toLowerCase());
  });
}


    setFilteredChats(filtered);
  }, [chats, activeCategory, user, query]);

  const onCancel = () => {
    setIsSearchActive(false);
    setQuery("");
  };

  const onSearch = (text: string) => {
    setQuery(text);
  };


  return (
    <>

      {selectionMode ? (
        <ChatActionBar
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          selectedChats={selectedChats}
          setSelectedChats={setSelectedChats}
        />

      ) : isSearchActive ? (
        <ActiveSearchBar onCancel={onCancel} onSearch={onSearch} />
      ) : (
        <Header handleLogout={handleLogout} />
      )}

      <ChatList
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        data={filteredChats}
        user={user}
        loading={loading}
        setIsSearchActive={setIsSearchActive}
        isSearchActive={isSearchActive}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        selectedChats={selectedChats}
        setSelectedChats={setSelectedChats}
      />
    </>
  );
}

type HeaderProps = {
  handleLogout: () => void | Promise<void>;
};

function Header({ handleLogout }: HeaderProps) {
  return (
    <View className="flex-row justify-between items-center bg-white pt-16 px-4">
      <Text className="text-2xl font-bold text-green-700">ChatApp</Text>
      <View className="flex-row gap-5 mb-4">
        <TouchableOpacity>
          <Ionicons size={24} name="qr-code-outline" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Feather size={24} name="more-vertical" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

type SearchBarProps = {
  setIsSearchActive: (active: boolean) => void;
  isSearchActive: boolean;
};

function SearchBar({ setIsSearchActive, isSearchActive }: SearchBarProps) {
  if (isSearchActive) return null;

  return (
    <TouchableOpacity
      className="mx-4 mb-3 flex-row items-center bg-gray-200 rounded-full px-4 py-2"
      onPress={() => setIsSearchActive(true)}
    >
      <Ionicons name="search" size={20} color="gray" />
      <Text className="ml-2 text-sm text-gray-800">Ask Meta AI or Search</Text>
    </TouchableOpacity>
  );
}

type CategoryProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

function CategoryTabs({ activeCategory, setActiveCategory }: CategoryProps) {
  const categories = ["All", "Unread", "Favourites", "Groups"];

  return (
    <View className="flex-row px-4 mb-3 gap-5">
      {categories.map((item, i) => (
        <TouchableOpacity key={i} onPress={() => setActiveCategory(item)}>
          <Text className={`text-sm px-3 py-1 rounded-full ${activeCategory === item ? 'bg-green-200' : 'bg-gray-200'}`}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

type ChatListProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  data: any[];
  user: any;
  loading: boolean;
  setIsSearchActive: (active: boolean) => void;
  isSearchActive: boolean;
  selectionMode: boolean;
  setSelectionMode: (active: boolean) => void;
  selectedChats: any[];
  setSelectedChats: (chats: any[]) => void;
};

function ChatList({ activeCategory, setActiveCategory, data, user, loading, setIsSearchActive, isSearchActive, selectionMode, setSelectionMode, selectedChats, setSelectedChats }: ChatListProps) {
  const dispatch = useDispatch();


  const focusConversation = (chat: any, focused: boolean) => {
    const socket = getSocket();
    if (!socket || !user._id) return;

    if (focused) {
      socket.emit("focus-conversation", chat._id); // emit just chatId

      // 🔥 Immediately update Redux to reset unread count for this chat
      dispatch(clearUnreadCount({ chatId: chat._id, userId: user._id }));

      // Set focused chat ID
      dispatch(setFocusedChatId(chat._id));

      // 🔁 Optionally: navigate to the chat screen if applicable
      // router.push(`/chat/${chat._id}`);
    }
  };


  const formatChat = ({ conv, currentUser }: { conv: any, currentUser: any }) => {

    const otherUser = getOtherUser(conv, currentUser._id);
    return {
      ...conv,
      name: otherUser?.name || otherUser?.phone || 'Unknown',
      message: conv.lastMessage?.text || '',
      unread: conv.unreadCounts?.[currentUser._id] || 0,
      createdAt: conv.lastMessage?.createdAt
        ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
      avatar: otherUser?.profileImg || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
    };
  };

  const formattedData = data.map(chat => formatChat({ conv: chat, currentUser: user }));

  const toggleChatSelection = (chat) => {
  setSelectedChats(prev => {
    const exists = prev.find(c => c._id === chat._id);
    return exists ? prev.filter(c => c._id !== chat._id) : [...prev, chat];
  });
};

function selectChat(chat) {
  if (!selectionMode) setSelectionMode(true);
  toggleChatSelection(chat);
}

function tapChat(chat) {
  if (selectionMode) {
    toggleChatSelection(chat);
  } else {
    focusConversation(chat, true);
  }
}

const isChatSelected = (chat: any) => {
  return selectedChats.some(selected => selected._id === chat._id);
};


  useEffect(() => {
    if (!(selectedChats.length > 0)) {
      setSelectionMode(false)
    }
  }, [selectedChats])

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading chats...</Text>
      </View>
    );
  }



  return (
    <View className="bg-white flex-1">
      {formattedData.length > 0 ? (
        <FlatList
          data={formattedData}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={() => (
            <>
              <SearchBar isSearchActive={isSearchActive} setIsSearchActive={setIsSearchActive} />
              <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            </>
          )}
          ListFooterComponent={() => (
            <View className="py-6 items-center justify-center">
              <MaterialCommunityIcons name="lock-outline" size={16} color="gray" />
              <Text className="text-gray-500 text-xs mt-2">
                Your personal messages are end-to-end encrypted.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity className={`flex-row items-center px-4 py-3 ${selectionMode && isChatSelected(item) ? 'bg-green-200' : ''}`}

              onLongPress={() => selectChat(item)}
              onPress={() => tapChat(item)}
            >
              <Image className="h-12 w-12 rounded-full" source={{ uri: item.avatar }} />
              <View className="flex-1 ml-4">
                <View className="flex-row justify-between">
                  <Text className="text-base text-black">{item.name}</Text>
                  <Text className="text-xs text-gray-500">{item.createdAt}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text numberOfLines={1} className="text-md text-gray-500 flex-1 mr-5">
                    {item.message}
                  </Text>
                  {item.unread > 0 && (
                    <View className="bg-green-600 min-w-[20px] rounded-full items-center justify-center px-2 ml-2">
                      <Text className="text-white text-xs font-bold">{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <EmptyChat />
      )}
    </View>
  );
}

function EmptyChat() {
  return (
    <View className="flex-1 items-center justify-center mt-10 p-6">
      <MaterialIcons name="chat-bubble-outline" size={100} color="gray" />
      <Text className="text-xl font-semibold mt-6">Start Chatting on ChatApp</Text>
      <Text className="text-center text-gray-500 mt-2">
        Tap the message icon below to start a new conversation
      </Text>
      <TouchableOpacity className="absolute bottom-6 right-6 bg-green-500 rounded-full p-4">
        <MaterialIcons name="message" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

type ActiveSearchBarProps = {
  onSearch: (text: string) => void;
  onCancel: () => void;
};

function ActiveSearchBar({ onSearch, onCancel }: ActiveSearchBarProps) {
  return (
    <View className='bg-white'>
      <View className='flex-row items-center bg-gray-200 rounded-full px-4 mx-4 py-2 my-3 mt-12'>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name='arrow-back' size={24} color="gray" />
        </TouchableOpacity>
        <TextInput
          onChangeText={onSearch}
          autoFocus
          placeholder='Search...'
          className='ml-3 flex-1 text-base text-black'
        />
      </View>
    </View>
  );
}


function ChatActionBar({
  selectionMode,
  setSelectionMode,
  selectedChats,
  setSelectedChats,
}: {
  selectionMode: boolean;
  setSelectionMode: (active: boolean) => void;
  selectedChats: any[];
  setSelectedChats: (chats: any[]) => void;
}) {
 
const handleDelete = () => {
  Alert.alert(
    "Confirm Deletion",
    "Are you sure you want to delete the selected chats?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const ids = selectedChats.map(chat => chat._id);
            const response = await ApiRequestPost.deleteChatData(ids);
            if (response) {
              setSelectedChats([]);
              setSelectionMode(false);
            }
          } catch (error) {
            console.log("Error:", error);
          }
        }
      }
    ]
  );
};


  return (
    <View className='bg-white'>
      <View className='flex-row justify-between p-3 bg-gray-200 mb-4'>
        <TouchableOpacity onPress={() => setSelectionMode(false)}>
          <Ionicons name='arrow-back' size={24} />
        </TouchableOpacity>

        <View className='flex-row gap-3'>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name='trash-outline' size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather size={24} name='more-vertical' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
