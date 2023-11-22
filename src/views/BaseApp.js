import { View, Text } from 'react-native'
import React from 'react'
import MainScreen from './MainScreen'
import Login from './auth/Login'
import { NavigationContainer } from '@react-navigation/native'
import { Stack } from './stack'

const BaseApp = () => {
    return (
        <NavigationContainer >
            <Stack.Navigator initialRouteName="Login" >
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="MainRoute" component={MainScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer >
    )
}


export default BaseApp