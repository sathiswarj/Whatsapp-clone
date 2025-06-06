import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getUser } from '@/util/storage';
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import axios from 'axios';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://192.168.29.174:4000/api';

export default function ChatsScreen() {
  const [chatList, setChatList] = useState([]);
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const router = useRouter();

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

        const response = await axios.get(`${API_URL}/conversation/${userdata._id}`);
        console.log("API response", response.data);
        setChatList(response.data || []);
      } catch (error) {
        console.log('Failed to fetch user or chats:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <Header handleLogout={handleLogout}/>
      <ChatList
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        data={chatList}
        user={user}
      />
    </>
  );
}

type HeaderProps = {
  handleLogout: () => void | Promise<void>;
};

function Header({ handleLogout }: HeaderProps) {
  return (
    <View className="flex-row justify-between items-center bg-white pt-10 px-4">
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

function SearchBar() {
  return (
    <View className="mx-4 mb-3 flex-row items-center bg-gray-200 rounded-full px-4 py-2">
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        placeholder="Ask Meta AI or Search"
        className="ml-2 flex-1 text-sm text-gray-800"
        placeholderTextColor="gray"
      />
    </View>
  );
}

function CategoryTabs({ activeCategory, setActiveCategory }) {
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

function ChatList({ activeCategory, setActiveCategory, data, user }: any) {
  const formatChat = ({ conv, currentUser }) => {
    console.log("UnreadCounts:", conv.unreadCounts);

    const otherUser = conv?.participants?.find(p => p._id !== currentUser._id);

    return {
      ...conv,
      name: otherUser?.phone,
      message: conv?.lastMessage?.text,
      unread: conv?.unreadCounts?.[currentUser._id] || 0,
      createdAt: new Date(conv?.lastMessage?.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      avatar: otherUser?.profileImg || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
    };
  };


  const formattedData = data.map(chat => formatChat({ conv: chat, currentUser: user }));

  return (
    <View className="bg-white flex-1">
      {formattedData.length > 0 ? (
        <FlatList
          data={formattedData}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyExtractor={(item) => item._id.toString()}
          ListHeaderComponent={() => (
            <>
              <SearchBar />
              <CategoryTabs
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
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
            <TouchableOpacity className="flex-row items-center px-4 py-3">
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
