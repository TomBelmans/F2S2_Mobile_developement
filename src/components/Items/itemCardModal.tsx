import React, {FunctionComponent} from 'react'
import {Image, StyleSheet, View} from 'react-native'
import {Modal, Portal, Text, useTheme} from 'react-native-paper'

import {useGetItemById} from '@/api/items'

interface ItemFormProps {
    itemId: string
    onhide: () => void
}

const ItemForm: FunctionComponent<ItemFormProps> = ({itemId, onhide}) => {
    const theme = useTheme()
    const {data: i} = useGetItemById(itemId)

    // Formateer datum naar dd/mm/yyyy
    const formatDate = (dateString: string | number) => {
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    return (
        <Portal>
            <Modal
                visible
                onDismiss={onhide}
                contentContainerStyle={[styles.modal, {backgroundColor: theme.colors.surface}]}>
                <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
                    <Image
                        style={styles.image}
                        source={{uri: i?.image}}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Titel</Text>
                        <Text style={styles.value}>{i?.itemTitle}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Omschrijving</Text>
                        <Text style={styles.value}>{i?.itemDescription}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Prijs</Text>
                        <Text style={styles.value}>{i?.price}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Datum geplaatst:</Text>
                        <Text style={styles.value}>{i?.date ? formatDate(i.date) : ''}</Text>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
        padding: 15,
        marginVertical: 10,
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '80%',
        borderRadius: 10,
        alignSelf: 'center',
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 10,
    },
    textContainer: {
        marginVertical: 10,
    },
    label: {
        fontWeight: 'bold',
    },
    value: {
        marginTop: 5,
    },
})

export default ItemForm
