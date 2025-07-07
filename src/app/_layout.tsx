import {MaterialCommunityIcons} from '@expo/vector-icons'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useFonts} from 'expo-font'
import {SplashScreen, Stack} from 'expo-router'
import {FunctionComponent, useEffect} from 'react'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

import {useGetCurrentUser} from '@/api/auth'
import ThemeProvider from '@/context/themeProvider'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // __DEV__ is een globale variabele die beschikbaar is in elk Expo project.
            // Net zoals import.meta.env.PROD in een Vite project kunnen we deze variable gebruiken om te bepalen of we
            // in een development of productieomgeving zitten.
            refetchOnWindowFocus: !__DEV__,
        },
    },
})

const ThemeWrapper: FunctionComponent = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <GestureHandlerRootView style={{flex: 1}}>
                    <RootLayout />
                </GestureHandlerRootView>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

const RootLayout: FunctionComponent = () => {
    const [loaded, error] = useFonts({
        ...MaterialCommunityIcons.font,
    })

    const {isSuccess: userLoaded} = useGetCurrentUser()

    useEffect(() => {
        if (error) throw error
    }, [error])

    useEffect(() => {
        if (loaded && userLoaded) {
            // Verberg het splashscreen als alle fonts geladen zijn.
            SplashScreen.hideAsync()
        }
    }, [loaded, userLoaded])
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    )
}

export default ThemeWrapper
