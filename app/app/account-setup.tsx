import React, { useState, useEffect } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, BackHandler } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiRequestPost } from '@/network/services/ApiRequestPost';
import {ApiRequestGet} from '@/network/services/ApiRequestGet';  

 
export default function Account() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [id, setId] = useState('');
  const { phoneNumber } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

const fetchUserData = async () => {
  try {
    const data = await ApiRequestGet.getUserData(phoneNumber);
    const user = data?.user;

    if (user) {
      setId(user.id);
      setName(user.name || '');
      setImage(user.profileImg || '');
    } else {
      console.error('No user data found');
    }
  } catch (error) {
    console.log("Error fetching user:", error);
    Alert.alert("Failed to fetch user data");
  }
};

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Name is required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phoneNumber);

      if (image && image.startsWith('file://')) {
        formData.append('profile', {
          uri: image,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);
      }

      let response;

      if (id) {
        response = await ApiRequestPost.updateUserData(id, formData);
      } else {
        response = await ApiRequestPost.createUserData(formData);
      }

      console.log("Create response:", response);

      const userData = response?.user || response?.data?.user;
      console.log("UserData received:", userData);

      if (userData) {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        router.push('/chats');
      } else {
        console.log("RAW RESPONSE:", response);
        Alert.alert("Something went wrong. No user data returned.");
      }


    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert("Network error or invalid response");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (phoneNumber) {
      fetchUserData();
    } else {
      Alert.alert('Phone number not found.');
    }
    const handleBackPress = () => {
      router.push('/');
      return true; // Prevent default back action
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackPress)

  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center bg-white p-6">
      <Text className="text-2xl font-bold text-center mt-10 mb-5">Account Setup</Text>

      <TouchableOpacity className="mb-4" onPress={pickImage}>
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-32 h-32 rounded-full border-2 border-gray-300"
          />
        ) : (
          <View className="w-32 h-32 bg-gray-200 rounded-full items-center justify-center border border-gray-400">
            <Text className="text-md text-gray-700 text-center">Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        className="border border-gray-300 rounded-lg p-4 text-lg w-full mb-4 text-center"
      />

      <TouchableOpacity
        className="p-4 w-full rounded-full bg-green-500 items-center justify-center"
        onPress={handleSave}
        disabled={!name.trim() || loading}
      >
        <Text className="text-white font-bold text-lg">
          {loading ? 'Saving...' : 'Save & Continue'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
