import { View, Text, Button } from 'react-native';
import React from 'react';
import { Stack, NavigationContainer } from '../stack';
import { saveToken } from '../../helper/asyncStorage';

const Setting = () => {
    return (
        // <NavigationContainer >
        <Stack.Navigator initialRouteName="SettingScreen" >
            <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
        // </NavigationContainer >
    )
}

const SettingScreen = ({ navigation }) => {

    const handleLogout = async () => {
        await saveToken('')
        await navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    return (
        <View style={{ padding: 10 }}>
            <Button onPress={handleLogout} title='Logout' />
        </View>
    )
}

export default Setting