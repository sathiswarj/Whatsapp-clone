import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { getUser } from '@/util/storage';

export default function chatsScreen() {
  const router = useRouter();
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.push('/')
  }

  const getUserData = async () => {
    const userdata = getUser();
    console.log('userdata', userdata);

  }

  useEffect(() => {
    getUserData();
  }, [])
  return (
    <View className="flex-1 justify-center items-center">
      <TouchableOpacity className="bg-red-500 rounded-full" onPress={handleLogout}>
        <Text className="text-white  p-3">Logout </Text>
      </TouchableOpacity>
    </View>
  )
}