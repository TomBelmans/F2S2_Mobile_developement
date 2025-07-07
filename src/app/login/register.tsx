import auth from '@react-native-firebase/auth'
import {Redirect, useRouter} from 'expo-router'
import React, {FunctionComponent, useState} from 'react'
import {Pressable, StyleSheet, Text, View} from 'react-native'
import {TextInput, Title, IconButton} from 'react-native-paper'

import useUser from '@/hooks/useUser'

interface RegisterProps {}

const Register: FunctionComponent<RegisterProps> = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const user = useUser()

    if (user) {
        return <Redirect href="/(tabs)/allItems" />
    }

    const handleSubmit = () => {
        auth().createUserWithEmailAndPassword(email, password)
    }

    const handleGoBack = () => {
        router.navigate('/login/login')
    }

    return (
        <View style={styles.container}>
            <Title style={styles.header}>Registatie</Title>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            <Pressable
                onPress={handleSubmit}
                style={styles.buttonInverted}>
                <Text style={styles.buttonTextInverted}>Registeer</Text>
            </Pressable>
            <Pressable onPress={handleGoBack}>
                <View style={styles.goBackButtonContainer}>
                    <IconButton
                        icon="arrow-left"
                        size={20}
                        onPress={handleGoBack}
                        style={styles.iconButton}
                    />
                    <Text style={styles.buttonText}>Ga terug</Text>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    header: {
        alignSelf: 'center',
        marginBottom: 10,
        textDecorationColor: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 10,
    },
    buttonInverted: {
        marginTop: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonTextInverted: {
        color: '#007bff',
    },
    goBackButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#007bff',
        borderRadius: 25,
        justifyContent: 'center',
    },
    iconButton: {
        margin: 0,
    },
    buttonText: {
        color: '#fff',
    },
})

export default Register
