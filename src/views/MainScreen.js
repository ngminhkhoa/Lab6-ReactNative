import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './child_bottom_nav/Home';
import Transaction from './child_bottom_nav/Transaction';
import Customer from './child_bottom_nav/Customer';
import Setting from './child_bottom_nav/Setting';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
const Tab = createBottomTabNavigator();

const MainScreen = () => {
    return (
        // <SafeAreaProvider>
        <Tab.Navigator screenOptions={{}}>
            <Tab.Screen name="Home" component={Home} options={{
                headerShown: false, tabBarIcon: ({ color, size }) => (
                    <Icon name="home-outline" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name="Transaction" component={Transaction} options={{
                headerShown: false, tabBarIcon: ({ color, size }) => (
                    <Icon name="cash-outline" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name="Customer" component={Customer} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Icon name="people-outline" color={color} size={size} />
                ),
            }} />
            <Tab.Screen name="Setting" component={Setting} options={{
                headerShown: false, tabBarIcon: ({ focused, color, size }) => (
                    <Icon name="settings-outline" color={color} size={size} />
                ),
            }} />
        </Tab.Navigator>
        // </SafeAreaProvider>
    )
}

export default MainScreen