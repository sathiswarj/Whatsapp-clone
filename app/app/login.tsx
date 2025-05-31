import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function login() {
  const [phoneNumber, setPhoneNumber] = useState("+91");

  const router = useRouter();
  const isValidNumber = /^\+\d{1,3}\s?\d{10}$/.test(phoneNumber)

  const handleNext = () => {
    if (!isValidNumber) {
      Alert.alert("Invalid number");
      return;
    }
    router.push({ pathname: "/otp", params: { phoneNumber } })
  }
  return (
    <>
      <View className='bg-white flex-1 items-center justify-center px-5'>
        <Text className="text-2xl font-bold text-gray-900 mb-4">Enter Your Phone Number</Text>
        <Text className='text-gray-500 text-lg  text-center mb-6'>WhatsApp will send an SMS to verify your Number</Text>
        <TextInput
          placeholder='+91 9876543210'
          keyboardType='phone-pad'
          className='border border-gray-300 rounded-lg p-4 text-lg w-full mt-2 text-center'
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <TouchableOpacity className={`${isValidNumber ? 'bg-green-500' : 'bg-gray-300'} px-6 py-4 rounded-full w-full text-lg font-semibold mt-4`} disabled={!isValidNumber} onPress={handleNext}>
          <Text className='text-center text-white font-bold'>Next</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}