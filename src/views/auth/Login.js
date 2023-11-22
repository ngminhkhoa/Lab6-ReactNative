import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import { BASE_URL } from '../../helper/test_data';
import { saveToken } from '../../helper/asyncStorage';

const Login = ({ navigation }) => {

    const [phone, setPhone] = useState("0373007856");
    const [password, setPassword] = useState("123");

    const data = {
        phone: phone,
        password: password
    };

    function login() {
        axios.post(BASE_URL + "auth", data)
            .then(async response => {
                console.log('Response:', response.data);
                console.log(response.status);
                await saveToken(response.data.token)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainRoute' }],
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <TextInput
                style={styles.input}
                placeholder='Phone'
                value={phone}
                onChangeText={setPhone} />
            <TextInput
                style={styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword} />
            <Button onPress={() => login()} title='Login' />
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'gray',
        height: 56,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    butonContainer: {
        backgroundColor: 'gray',
        height: 56,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
})