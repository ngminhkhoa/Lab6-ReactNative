import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async (token) => {
    try {
        await AsyncStorage.setItem('userToken', token);
        console.log('Token saved successfully!');
    } catch (error) {
        console.error('Error saving token:', error);
        throw new Error('Error saving token');
    }
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        throw new Error('Error getting token');
    }
};