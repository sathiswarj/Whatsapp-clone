import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from "react-native";
import './global.css';
export default function Index() {
  const router = useRouter();
  return (
    <>
      <View className="bg-white flex-1 items-center justify-center px-5">
        {/* <Image className="w-28 h-28 mb-4" source={images.logo} /> */}
        <Text className="text-2xl font-bold text-gray-900">Welcome to WhatsApp</Text>
        <Text className='text-gray-600 mt-2 text-center text-lg mb-8'>Read Our
          <Text className='text-blue-500'> Privacy Policy </Text>.Tap "Agree and Continue" to accept the
          <Text className='text-blue-500'> Terms and Conditions </Text></Text>
        <TouchableOpacity className='text-white bg-green-500 px-6 py-4 rounded-full w-full text-lg font-semibold' onPress={() => { router.push('/login'); }}>
          <Text className='text-center text-white font-bold'>Agree and Continue</Text>
        </TouchableOpacity>
      </View>

    </>
  );
}
