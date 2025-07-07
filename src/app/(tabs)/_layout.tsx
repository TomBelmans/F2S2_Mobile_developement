import {Tabs, Redirect} from 'expo-router'
import React from 'react'
import {Button, Icon, useTheme} from 'react-native-paper'

import {useSignOut} from '@/api/auth'
import useUser from '@/hooks/useUser'

const TabLayout = () => {
    const theme = useTheme()
    const user = useUser()
    const {mutate: signOut} = useSignOut()

    if (!user) {
        return <Redirect href="/login/login" />
    }

    const handleLogout = () => {
        signOut()
    }

    const logoutButton = () => (
        <Button
            icon="logout"
            onPress={handleLogout}>
            Uitloggen
        </Button>
    )

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.onSurface,
                headerShown: true,
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: theme.colors.surface,
                },
            }}>
            <Tabs.Screen
                name="allItems"
                options={{
                    title: 'Artikel lijst',
                    tabBarIcon: ({color, size}) => (
                        <Icon
                            source="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    ),
                    headerLeft: logoutButton,
                }}
            />
            <Tabs.Screen
                name="newItem"
                options={{
                    title: 'Nieuw artikel',
                    tabBarIcon: ({size, color}) => (
                        <Icon
                            source="plus-circle"
                            size={size}
                            color={color}
                        />
                    ),
                    headerLeft: logoutButton,
                }}
            />
            <Tabs.Screen
                name="mijnItems"
                options={{
                    title: 'Mijn artikelen',
                    tabBarIcon: ({size, color}) => (
                        <Icon
                            source="account-circle"
                            size={size}
                            color={color}
                        />
                    ),
                    headerLeft: logoutButton,
                }}
            />
        </Tabs>
    )
}

export default TabLayout
