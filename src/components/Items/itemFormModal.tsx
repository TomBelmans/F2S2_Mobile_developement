import React, {FunctionComponent, useState, useEffect} from 'react'
import {Image, StyleSheet, View, Button} from 'react-native'
import {Modal, Portal, TextInput, useTheme} from 'react-native-paper'

import {useGetItemById, useUpdateItem, useUploadImageToFirebase} from '@/api/items'
import CameraUI from '@/components/lib/cameraUI'

interface ItemFormProps {
    itemId: string
    onhide: () => void
}

const ItemForm: FunctionComponent<ItemFormProps> = ({itemId, onhide}) => {
    const theme = useTheme()
    const {data: item, isLoading} = useGetItemById(itemId)
    const {mutate: updateItemMutation} = useUpdateItem()
    const {mutate: updateImageMutation} = useUploadImageToFirebase()
    const [showCamera, setShowCamera] = useState(false)
    const [titel, setTitel] = useState('')
    const [prijs, setPrijs] = useState('')
    const [omschrijving, setOmschrijving] = useState('')
    const [selectedimage, setSelectedImage] = useState('')

    useEffect(() => {
        if (item) {
            setSelectedImage(item.image)
            setTitel(item.itemTitle)
            setOmschrijving(item.itemDescription)
            setPrijs(item.price)
        }
    }, [item])

    const handleSave = () => {
        if (item) {
            if (selectedimage !== item.image) {
                updateImageMutation({filename: selectedimage})
                updateItemMutation(
                    {
                        ...item,
                        id: itemId,
                        itemTitle: titel,
                        itemDescription: omschrijving,
                        price: prijs,
                        image: selectedimage,
                    },
                    {
                        onSuccess: () => {
                            onhide()
                        },
                    },
                )
            }
        }
    }

    if (isLoading || !item) {
        return null
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
                        source={{uri: selectedimage}}
                    />
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Verander afbeelding"
                            onPress={() => setShowCamera(true)}
                        />
                    </View>
                    <TextInput
                        style={styles.textinputContainer}
                        mode="outlined"
                        label="Titel"
                        value={titel}
                        onChangeText={setTitel}
                    />
                    <TextInput
                        style={styles.textinputContainer}
                        mode="outlined"
                        label="Omschrijving"
                        value={omschrijving}
                        onChangeText={setOmschrijving}
                    />
                    <TextInput
                        style={styles.textinputContainer}
                        mode="outlined"
                        label="Prijs"
                        value={prijs}
                        onChangeText={setPrijs}
                    />
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Opslaan"
                            onPress={handleSave}
                        />
                    </View>
                </View>
                {showCamera && (
                    <CameraUI
                        showCamera={showCamera}
                        cameraType="back"
                        onClose={() => setShowCamera(false)}
                        onPictureTaken={setSelectedImage}
                    />
                )}
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
    buttonContainer: {
        margin: 10,
    },
    textinputContainer: {
        marginVertical: 10,
    },
})

export default ItemForm
