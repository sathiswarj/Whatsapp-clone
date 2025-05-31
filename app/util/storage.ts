import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const saveToStorage = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving data[ ${key}] to storage:`, error);
    }
}

export const removeFromStorage = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing data [${key} ]to storage:`, error);
    }
}

export const getFromStorage = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
            JSON.parse(value);
        }
        else {
            return null;
        }
    } catch (error) {
        console.error(`Error getting data [${key}] to storage:`, error);
    }
}

const USER_KEY = 'user';
export const getUser = async () => getFromStorage(USER_KEY)
export const saveUser = async (user: any) => saveToStorage(USER_KEY,user)
export const removeUser = async () => removeFromStorage(USER_KEY)

