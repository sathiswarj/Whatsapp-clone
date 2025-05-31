import { useRouter, usePathname } from 'expo-router';
import { Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import './global.css';
import { useState, useEffect } from 'react';
import { getFromStorage } from '@/util/storage';
import { images } from '@/constants/images';

export default function Index() {
  const router = useRouter();
  const pathname = usePathname(); // get current path
  const [checkingAuth, setCheckingAuth] = useState(true); // rename to be clearer

  useEffect(() => {
    const redirectUser = async () => {
      try {
        const user = await getFromStorage('user');
        if (user && pathname !== '/chatsscreen') {
          router.replace('/chatsscreen');
        } else {
          setCheckingAuth(false); // allow screen to render if no user
        }
      } catch (error) {
        console.log('Error', error);
        setCheckingAuth(false);
      }
    };

    redirectUser();
  }, []);

  if (checkingAuth) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View className="bg-white flex-1 items-center justify-center px-5">
      <Image className="w-28 h-28 mb-4" source={images.logo} />
      <Text className="text-2xl font-bold text-gray-900">Welcome to WhatsApp</Text>
      <Text className="text-gray-600 mt-2 text-center text-lg mb-8">
        Read Our
        <Text className="text-blue-500"> Privacy Policy </Text>. Tap "Agree and Continue" to accept the
        <Text className="text-blue-500"> Terms and Conditions </Text>
      </Text>
      <TouchableOpacity
        className="text-white bg-green-500 px-6 py-4 rounded-full w-full text-lg font-semibold"
        onPress={() => {
          router.push('/login');
        }}
      >
        <Text className="text-center text-white font-bold">Agree and Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
