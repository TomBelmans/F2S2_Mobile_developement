import {useRouter, useNavigation} from 'expo-router'
import React, {FunctionComponent, useEffect, useState} from 'react'
import {View, ScrollView, StyleSheet, Pressable, Image} from 'react-native'
import {Text, TextInput, IconButton} from 'react-native-paper'

import {useAddItem, useUploadImageToFirebase} from '@/api/items'
import CategoryPicker from '@/components/Items/categoryPicker'
import CameraUI from '@/components/lib/cameraUI'
import {ICategories} from '@/models/ICategories'

interface NewItemProps {}

const NewItem: FunctionComponent<NewItemProps> = () => {
    const navigation = useNavigation()
    const router = useRouter()
    const [titel, setTitel] = useState('')
    const [prijs, setPrijs] = useState('')
    const [omschrijving, setOmschrijving] = useState('')
    const [showCamera, setShowCamera] = useState<boolean>(false)
    const [fotoUri, setFotoUri] = useState<string | null>(null)
    const [categorie, setCategorie] = useState<ICategories | null>(null)
    const {mutate: addItem} = useAddItem()
    const {mutate: uploadImage} = useUploadImageToFirebase()

    const handleSubmit = async () => {
        if (!categorie) {
            alert('Selecteer een categorie.')
            return
        }

        if (!fotoUri) {
            alert('Voeg een afbeelding toe.')
            return
        }

        if (!titel) {
            alert('Voeg een titel toe.')
            return
        }

        if (!prijs) {
            alert('Voeg een prijs toe.')
            return
        }

        if (!omschrijving) {
            alert('Voeg een omschrijving toe.')
            return
        }

        uploadImage(
            {filename: fotoUri},
            {
                onSuccess: url => {
                    const itemData = {
                        itemTitle: titel,
                        itemDescription: omschrijving,
                        price: prijs,
                        image: url,
                        category: categorie,
                    }

                    addItem(itemData, {
                        onSuccess: () => {
                            setTitel('')
                            setPrijs('')
                            setOmschrijving('')
                            setFotoUri(null)
                            setCategorie(null)
                            router.push('../(tabs)/allItems')
                        },
                        onError: error => {
                            alert('Fout bij opslaan: ' + error.message)
                        },
                    })
                },
                onError: error => {
                    alert('Fout bij het uploaden van de afbeelding: ' + error.message)
                },
            },
        )
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}: {tintColor: string}) => (
                <IconButton
                    iconColor={tintColor}
                    icon="camera-plus"
                    onPress={() => setShowCamera(true)}
                />
            ),
        })
    }, [showCamera])

    return (
        <ScrollView style={styles.container}>
            <CameraUI
                showCamera={showCamera}
                cameraType="front"
                onClose={imageData => {
                    setShowCamera(false)
                    // imageData is een object met een uri key
                    if (imageData) {
                        setFotoUri(imageData.path)
                    }
                }}
            />

            <View style={styles.cameraPreview}>
                {fotoUri ? (
                    <Image
                        source={{uri: fotoUri}}
                        style={styles.image}
                    />
                ) : null}
            </View>

            <TextInput
                label="Titel"
                value={titel}
                onChangeText={setTitel}
            />
            <TextInput
                label="Prijs"
                value={prijs}
                onChangeText={setPrijs}
                keyboardType="numeric"
            />
            <TextInput
                label="Omschrijving"
                value={omschrijving}
                onChangeText={setOmschrijving}
                multiline
            />
            <CategoryPicker onCategoryPicked={setCategorie} />

            <Pressable
                onPress={handleSubmit}
                style={styles.button}>
                <Text style={styles.buttonText}>Opslaan</Text>
            </Pressable>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    galleryContainer: {
        flex: 1,
        alignContent: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cameraPreview: {
        alignItems: 'center',
        marginVertical: 20,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
    },
})

export default NewItem
