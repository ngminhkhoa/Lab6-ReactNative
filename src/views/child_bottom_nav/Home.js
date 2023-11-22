import { View, Text, Alert, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MenuProvider } from 'react-native-popup-menu';
import { Stack, NavigationContainer } from '../stack';
import axios from 'axios';
import { BASE_URL } from '../../helper/test_data';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons'
import { getToken } from '../../helper/asyncStorage';

const Home = () => {
    return (
        <MenuProvider>
            {/* <NavigationContainer > */}
            <Stack.Navigator initialRouteName="Homee" >
                <Stack.Screen name="Homee" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Add" component={AddServiceScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Update" component={UpdateServiceScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Detail" component={DetailServiceScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
            {/* </NavigationContainer> */}
        </MenuProvider>
    )
}

const HomeScreen = ({ navigation }) => {

    const [services, setServices] = useState([])

    async function getServices() {
        await axios.get(BASE_URL + "services")
            .then(response => {
                console.log('Response:', response.data);
                console.log(response.status);
                setServices(response.data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        getServices()
    }, [])

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 25 }}>Danh sách dịch vụ</Text>
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity onPress={() => navigation.navigate("Add")}>
                    <View style={{
                        width: 35,
                        height: 35,
                        borderRadius: 35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'red'
                    }}>
                        <Icon name="add-outline" size={20} color={'white'} />
                    </View>
                </TouchableOpacity>
            </View>
            {
                services.length === 0 ? <Text style={{ color: 'black' }}>Not find any services</Text> :
                    <FlatList
                        style={{ marginTop: 15 }}
                        data={services}
                        keyExtractor={(item, index) => index}
                        renderItem={(item) => {
                            const service = item.item;
                            return (
                                <TouchableOpacity onPress={() => navigation.navigate('Detail', { service })}>
                                    <View style={{
                                        borderColor: 'black',
                                        borderWidth: 2,
                                        borderRadius: 5,
                                        padding: 10,
                                        margin: 5,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ flex: 1, fontSize: 19, color: 'black' }}>{service.name}</Text>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 17, color: 'black' }}>{service.price} đ</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }} />
            }
        </View>
    )
}

const AddServiceScreen = () => {

    const [nameService, setNameService] = useState("");
    const [priceService, setPriceService] = useState(0);

    async function addService() {
        console.log(nameService);
        console.log(priceService);

        const data = {
            name: nameService,
            price: priceService
        };

        const token = await getToken();

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        await axios.post(BASE_URL + "services", data, {
            headers
        })
            .then(response => {
                console.log('Response:', response.data);
                console.log(response.status);
                Alert.alert(
                    'Message',
                    'Add new service successful',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={{ color: 'black', fontSize: 25 }}>Add Service</Text>
            <Text>Service name</Text>
            <TextInput style={{ backgroundColor: '#ff0033' }} onChangeText={(data) => setNameService(data)} value={nameService} placeholderTextColor="black" placeholder='Input a service name' />
            <Text>Price</Text>
            <TextInput style={{ backgroundColor: '#ff0033' }} keyboardType='numeric' onChangeText={(data) => setPriceService(data)} value={`${priceService}`} placeholderTextColor="black" placeholder='0' />
            <Button onPress={() => addService()} title='Add' />
        </View>
    )
}

const UpdateServiceScreen = ({ route, navigation }) => {

    const [currentService, setCurrentService] = useState(null);
    const [nameService, setNameService] = useState("");
    const [priceService, setPriceService] = useState(0);

    useEffect(() => {
        const service = route.params.service
        console.log(service);
        setCurrentService(service)
        setNameService(service.name)
        setPriceService(service.price)
    }, [route.params])

    async function updateService() {
        console.log();

        const data = {
            id: currentService._id,
            name: nameService,
            price: priceService
        }
        const token = await getToken();

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        await axios.put(BASE_URL + `services/${currentService._id}`, data, {
            headers
        })
            .then(response => {
                console.log('Response:', response.data);
                console.log(response.status);
                Alert.alert(
                    'Message',
                    'Update service successful',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch(error => {
                console.error('Error:', error);
                Alert.alert(
                    'Message',
                    error,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
            });
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <Text style={{ color: 'black', fontSize: 25 }}>Update Service</Text>
            <Text>Service name</Text>
            <TextInput style={{ backgroundColor: '#ff0033' }} onChangeText={(data) => setNameService(data)} value={nameService} placeholderTextColor="black" placeholder='Input a service name' />
            <Text>Price</Text>
            <TextInput style={{ backgroundColor: '#ff0033' }} keyboardType='numeric' onChangeText={(data) => setPriceService(data)} value={`${priceService}`} placeholderTextColor="black" placeholder='0' />
            <Button onPress={() => updateService()} title='Update' />
        </View>
    )
}

const DetailServiceScreen = ({ route, navigation }) => {
    const [currentService, setCurrentService] = useState(null);

    useEffect(() => {
        const service = route.params.service
        console.log(service);
        setCurrentService(service)
    }, [route.params])

    const handleAction = () => {
        // Action to perform when the action button is pressed
        console.log('Action button pressed');
        // You can add your action logic here
    };

    async function deleteService() {
        console.log(currentService);

        const token = await getToken();

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        await axios.delete(BASE_URL + `services/${currentService._id}`, {
            headers
        })
            .then(response => {
                console.log('Response:', response.data);
                console.log(response.status);
                Alert.alert(
                    'Message',
                    'Delete service successful',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
            })
            .catch(error => {
                console.error('Error:', error);
                Alert.alert(
                    'Message',
                    error,
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                        },
                    ],
                    { cancelable: false }
                );
            });
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: '#fff', padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'black', fontSize: 25 }}>Detail Service</Text>
                <Menu>
                    <MenuTrigger>
                        <Icon name="ellipsis-vertical-outline" size={20} color={'black'} />
                    </MenuTrigger>
                    <MenuOptions>
                        <MenuOption onSelect={() => navigation.navigate('Update', { service: currentService })} text="Update" />
                        <MenuOption onSelect={() => deleteService()} text="Delete" />
                    </MenuOptions>
                </Menu>
            </View>
            <View style={{ flex: 1, padding: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Service name: {currentService?.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Price: {currentService?.price} đ</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Time: {currentService?.time}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'black', fontSize: 20 }}>Final update: {currentService?.updatedAt}</Text>
                </View>
            </View>
        </View>
    )
}

export default Home