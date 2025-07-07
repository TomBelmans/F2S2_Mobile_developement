import {Redirect} from 'expo-router'
import React, {FunctionComponent} from 'react'

import useUser from '@/hooks/useUser'

interface IndexProps {}

const Index: FunctionComponent<IndexProps> = () => {
    const user = useUser()

    if (!user) {
        return <Redirect href="/login/login" />
    }

    return <Redirect href="/(tabs)/allItems" />
}

export default Index
