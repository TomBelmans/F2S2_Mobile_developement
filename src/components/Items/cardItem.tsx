import React, {FunctionComponent} from 'react'
import {View, Text, Image, StyleSheet, Pressable} from 'react-native'

import IItem from '@/models/IItem'

interface CardItemProps extends IItem {
    onPress: () => void
}

const CardItem: FunctionComponent<CardItemProps> = ({onPress, ...i}) => {
    const readableDate = new Date(i.date).toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <Pressable
            style={styles.card}
            onPress={onPress}>
            <View style={styles.textSection}>
                <Text style={styles.title}>{i.itemTitle}</Text>
                <Text style={styles.description}>{i.itemDescription}</Text>
                <Text style={styles.price}>{i.price} €</Text>
                <Text style={styles.date}>{readableDate}</Text>
            </View>
            <Image
                source={{uri: i.image}}
                style={styles.image}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        margin: 10,
    },
    textSection: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginVertical: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00ff00',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    date: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
})
export default CardItem
