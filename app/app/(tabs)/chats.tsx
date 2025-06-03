import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getUser } from '@/util/storage';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function ChatsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.push('/');
  };

  const getUserData = async () => {
    try {
      const userdata = await getUser();
      console.log('userdata', userdata);
    } catch (error) {
      console.log('Failed to fetch user:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <Header />
      <SearchBar />

    </>
  );
}

function Header() {
  return (
    <View className="flex-row justify-between items-center bg-white pt-10 mb-4 px-4">
      <Text className="text-2xl font-bold text-green-700">ChatApp</Text>
      <View className="flex-row gap-5">
        <TouchableOpacity>
          <Ionicons size={24} name="qr-code-outline" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather size={24} name="more-vertical" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


function SearchBar(){
  return(
    <View className="mx-4 mb-3 flex-row items-center bg-gray-200 rounded-full px-4 py-2">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Ask Meta AI or Search"
          className="ml-2 flex-1 text-sm text-gray-800"
          placeholderTextColor="gray"
        />
      </View>
  )
}
