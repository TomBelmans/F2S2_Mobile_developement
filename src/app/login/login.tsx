import auth from '@react-native-firebase/auth'
import {useRouter} from 'expo-router'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {Image, Pressable, StyleSheet, Text, View} from 'react-native'
import {TextInput, Title, Button} from 'react-native-paper'

import {AuthProvider, useSignIn} from '@/api/auth'
import useUser from '@/hooks/useUser'

interface LoginProps {}

const Login: FunctionComponent<LoginProps> = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const {mutate: signInWithSocialAuth, isSuccess: isLoggedIn} = useSignIn()
    const router = useRouter()
    const user = useUser()

    useEffect(() => {
        if (user) {
            router.push('/(tabs)/allItems')
        }
    }, [user])

    const handleSubmit = async () => {
        if (!email || !password) {
            setError('Email en wachtwoord zijn verplicht.')
            return
        }

        try {
            await auth().signInWithEmailAndPassword(email, password)
            console.log(user?.uid)
        } catch (error) {
            setError('Ongeldig e-mailadres of wachtwoord. Probeer het opnieuw.')
        }
    }

    const navigateToRegister = () => {
        router.navigate('/login/register')
    }

    return (
        <View style={styles.container}>
            <Title style={styles.header}>SwapIt</Title>
            <Image
                source={require('../../assets/SwapItLogo.jpeg')}
                style={styles.logo}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TextInput
                label="Email"
                value={email}
                onChangeText={text => {
                    setEmail(text)
                    setError(null)
                }}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={text => {
                    setPassword(text)
                    setError(null)
                }}
                style={styles.input}
                secureTextEntry
            />
            <Pressable
                onPress={handleSubmit}
                style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable
                onPress={navigateToRegister}
                style={styles.buttonInverted}>
                <Text style={styles.buttonTextInverted}>Registreer jezelf</Text>
            </Pressable>

            <Button
                icon="google"
                mode="outlined"
                contentStyle={[styles.loginButtonContent]}
                style={[styles.loginButton]}
                onPress={() => signInWithSocialAuth({provider: AuthProvider.GOOGLE})}>
                Login with Google
            </Button>
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
    logo: {
        alignSelf: 'center',
        width: '20%',
        height: 100,
        marginBottom: '20%',
        borderRadius: 25,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
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
    loginButtonContainer: {
        flex: 1,
        margin: 20,
        marginTop: 70,
    },
    loginButton: {
        width: '100%',
        marginVertical: 10,
        borderRadius: 30,
    },
    loginButtonContent: {
        display: 'flex',
        justifyContent: 'flex-start',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
})

export default Login
