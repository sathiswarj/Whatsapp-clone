import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function otp() {
    const router = useRouter();
    const { phoneNumber } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const [error, setError] = useState('');

    const generateOtp = () => {
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(randomOtp);
        console.log(`OTP sent to ${phoneNumber}: ${randomOtp}`);
    }

    const resendOtp = () => {
        setTimer(30);
        generateOtp();
        console.log(`OTP resent to ${phoneNumber}: ${generatedOtp}`);
    }

    const handleVerifyOtp = () => {
        setError('');
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTp")
        }
        else if (otp === generatedOtp) {
            router.push({ pathname: '/account-setup', params: { phoneNumber } });
        }
        else {
            setError('Invalid OTP, Please enter the correct OTP')
        }
    }


    useEffect(() => {
        generateOtp();
        const countDown = setInterval(() => {
            setTimer((prev) => prev > 0 ? prev - 1 : 0);
            return () => clearInterval(countDown);
        }, 1000);

    }, [phoneNumber]);

    return (
        <View className='bg-white flex-1 items-center justify-center px-5'>
            <Text className="text-2xl font-bold text-gray-900 mb-4">Enter OTP</Text>
            <Text className='text-gray-500 text-lg  text-center mb-6'>Six digits code has been sent to {phoneNumber}</Text>
            <Text className='text-gray-500 text-lg  text-center mb-6'>Your OTP is: <Text className='text-blue-500'>{generatedOtp}</Text></Text>
            <TextInput
                placeholder='Enter OTP'
                keyboardType='number-pad'
                className='border border-gray-300 rounded-lg p-4 text-lg w-3/4 mt-2 text-center'
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
            />
            {error ? <Text className='text-red-500 text-lg mt-2'>{error}</Text> : null}
            <TouchableOpacity className='bg-green-500 px-6 py-4 rounded-full w-full text-lg font-semibold mt-4' onPress={handleVerifyOtp}>
                <Text className='text-center text-white font-bold'>Verify OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity className='mt-4' onPress={() => router.back()}>
                <Text className='text-blue-500 text-lg'>Change Number</Text>
            </TouchableOpacity>
            <TouchableOpacity className=' mt-3' onPress={resendOtp} disabled={timer > 0}>
                <Text className={`text-lg ${timer > 0 ? 'text-blue-500' : 'text-blue-400'}`}>{timer > 0 ? `Resend OTP in ${timer} secs` : 'Resend'}</Text>
            </TouchableOpacity>
        </View>
    )
}