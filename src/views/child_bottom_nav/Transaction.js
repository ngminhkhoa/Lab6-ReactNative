import { View, Text, StyleSheet, TouchableOpacity, Button, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, NavigationContainer } from '../stack';
import axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { set } from 'mobx';
import { BASE_URL } from '../../helper/test_data';

const Transaction = () => {
    return (
        // <NavigationContainer >
            <Stack.Navigator initialRouteName="TransactionScreen" >
                <Stack.Screen name="TransactionScreen" component={TransactionScreen} options={{ headerShown: true }} />
                <Stack.Screen name="TransactionDetailScreen" component={TransactionDetailScreen} options={{ headerShown: true }} />
            </Stack.Navigator>
        // </NavigationContainer >
    )
}

const TransactionScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`${BASE_URL}transactions`);
                const data = response.data;
                console.log(data);
                setTransactions(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const convertDateFormat = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;

        return formattedDate;
    };


    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item, index) => item._id}
                    renderItem={({ item }) => {
                        const { id, createdAt, customer, services } = item;
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate("TransactionDetailScreen", { detail: item })} >
                                <View style={styles.transactionContainer}>
                                    <View style={styles.contentContainer}>
                                        <View style={styles.firstRow}>
                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>{id}</Text>

                                            <Text style={{ color: 'black', fontWeight: 'bold' }}>  -  {convertDateFormat(createdAt)}</Text>
                                        </View>

                                        <View style={styles.servicesContainer}>
                                            {services.map((service, index) => (
                                                <Text style={{ color: 'black' }} key={index}>- {service.name}</Text>
                                            ))}
                                        </View>

                                        <Text style={{ color: 'gray' }}>Customer: {customer.name}</Text>
                                    </View>
                                    <Text style={{ color: 'black', fontWeight: 'bold', color: 'red' }}>{item.price} đ</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            )}

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {

                }}
            >
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View >
    )
}

const TransactionDetailScreen = ({ route, navigation }) => {

    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        const detailData = route.params.detail;
        console.log(detailData);
        setTransaction(detailData);
    }, [route.params])

    const convertDateFormat = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${hours}:${minutes}:${seconds}`;

        return formattedDate;
    };

    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: 'white', margin: 10, padding: 10, borderRadius: 10, }}>
                <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>General information</Text>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Text style={{ color: 'gray', fontWeight: 'bold', }}>Transaction code</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{transaction?.id}</Text>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Text style={{ color: 'gray', fontWeight: 'bold', }}>Customer</Text>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>{transaction?.customer?.name}</Text>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}> - {transaction?.customer?.phone}</Text>
                    </View>

                </View>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Text style={{ color: 'gray', fontWeight: 'bold', }}>Creation time</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{convertDateFormat(transaction?.createdAt)}</Text>
                </View>

            </View>

            <View style={{ backgroundColor: 'white', margin: 10, padding: 10, borderRadius: 10, }}>
                <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>Service list</Text>
                <FlatList
                    data={transaction?.services}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.serviceItem}>
                            <Text style={styles.serviceName}>{item.name}</Text>
                            <View style={{ flex: 1 }}></View>
                            <Text style={styles.serviceQuantity}>x{item.quantity}</Text>
                            <View style={{ flex: 1 }}></View>
                            <Text style={styles.servicePrice}>{item.price}đ</Text>
                        </View>
                    )}
                />
                <View style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 10, borderTopColor: 'black', borderTopWidth: 0.2 }}>
                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Total</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{transaction?.priceBeforePromotion} đ</Text>
                </View>
            </View>

            <View style={{ backgroundColor: 'white', margin: 10, padding: 10, borderRadius: 10, }}>
                <Text style={{ color: 'red', fontWeight: 'bold', marginBottom: 10 }}>Cost</Text>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Text style={{ color: 'gray', fontWeight: 'bold', }}>Amount of money</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{transaction?.priceBeforePromotion}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <Text style={{ color: 'gray', fontWeight: 'bold', }}>Discount</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>- {transaction?.priceBeforePromotion - transaction?.price} đ</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 10, borderTopColor: 'black', borderTopWidth: 0.2 }}>
                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>Total payment</Text>
                    <View style={{ flex: 1 }}></View>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{transaction?.price} đ</Text>
                </View>
            </View>
        </View>
    )
}

export default Transaction

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicatorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    transactionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    transactionContainer: {
        padding: 10,
        margin: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        maxWidth: '100%',
        backgroundColor: 'white'
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginRight: 10,
    },
    firstRow: {
        flexDirection: 'row',
        flex: 1,
    },
    servicesContainer: {
        flex: 1,
        marginTop: 5,
        marginBottom: 10,
    },
    servicesTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'black'
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        justifyContent: 'flex-start',
    },
    serviceName: {
        color: 'black',
        fontWeight: 'bold',
        width: '50%',
        flexWrap: 'wrap'
    },
    serviceQuantity: {
        color: 'gray',
        fontWeight: 'bold',
    },
    servicePrice: {
        color: 'red',
        fontWeight: 'bold',
    },
});