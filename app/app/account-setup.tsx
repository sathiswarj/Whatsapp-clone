// components/Account.tsx
import React, { useEffect } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator, BackHandler } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
 import { fetchUserData, addUserData, setImage, setName } from '@/store/slice/usersSlice';

export default function Account() {
  const { phoneNumber } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { name, image, id, loading } = useSelector((state: RootState) => state.user);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      dispatch(setImage(result.assets[0].uri));
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Name is required");
      return;
    }

    dispatch(addUserData({ name, phoneNumber, image, id }));
    router.push('/chats');
  };

  useEffect(() => {
    if (phoneNumber) {
      dispatch(fetchUserData(phoneNumber));
    } else {
      Alert.alert('Phone number not found.');
    }

    const handleBackPress = () => {
      router.push('/');
      return true;
    };

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
        onChangeText={(text) => dispatch(setName(text))}
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
