import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, NavigationContainer } from '../stack';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import { BASE_URL } from '../../helper/test_data';
import { getToken } from '../../helper/asyncStorage';

const Customer = () => {
    return (
        // <NavigationContainer >
        <Stack.Navigator initialRouteName="CustomerScreen" >
            <Stack.Screen name="CustomerScreen" component={CustomerScreen} options={{ headerShown: true }} />
            <Stack.Screen name="AddCustomerScreen" component={AddCustomerScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
        // </NavigationContainer >
    )
}

const CustomerScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [customers, setCustomers] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}customers`);
            setCustomers(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            ) : (
                <FlatList
                    data={customers}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.customerItem}>
                            <View>
                                <Text style={{ color: 'black' }}>Customer: {item.name}</Text>
                                <Text style={{ color: 'black' }}>Phone: {item.phone}</Text>
                                <Text style={{ color: 'black' }}>Total money: {item.totalSpent}đ</Text>
                            </View>
                            <View style={{ flex: 1 }}></View>
                            <Text style={{ color: 'red', fontWeight: 'bold', margin: 10 }}>{item.loyalty}</Text>

                            {/* Render other customer details */}
                        </View>
                    )
                    }
                />
            )}

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {
                    navigation.navigate('AddCustomerScreen');
                }}
            >
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View >
    )
}

const AddCustomerScreen = ({ navigation }) => {

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const alertDialog = (title, subtitle) => Alert.alert(
        title,
        subtitle,
        [
            {
                text: 'Ok',
                onPress: () => { },
                style: 'cancel',
            },
        ],
        {
            cancelable: true,
            onDismiss: () => { },
        },
    );

    const handleAddCustomer = async () => {
        try {
            const token = await getToken();
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const body = { name, phone };

            const response = await axios.post(
                `${BASE_URL}customers`,
                body,
                {
                    headers: headers,
                });

            // Handle response here (if needed)
            console.log('Response:', response.data);

            // Clear input fields after successful submission
            setName('');
            setPhone('');
            alertDialog("Message", "Add new customer successful")
        } catch (error) {
            console.error('Error adding customer:', error);
            // Handle error if necessary
            alertDialog("Message", "Add new customer failed")
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Input your customer's name"
            />
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Input phone number"
                keyboardType="phone-pad" />
            <Button onPress={handleAddCustomer} title='Add' />
        </View>
    )
}

export default Customer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    indicatorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        backgroundColor: 'gray',
        height: 56,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    floatingButton: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,
        right: 20,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    outerContainer: {
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 5,
        margin: 10,
    },
    customerItem: {
        margin: 10,
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 0.5,
    }
});