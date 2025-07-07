import {Ionicons} from '@expo/vector-icons'
import React, {useState} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback, Text} from 'react-native'
import {Portal, Modal, useTheme} from 'react-native-paper'

import {ICategories} from '@/models/ICategories'

interface CategoryPickerProps {
    onCategoryPicked: (category: ICategories) => void
}

const CategoryPicker: React.FunctionComponent<CategoryPickerProps> = ({onCategoryPicked}) => {
    const theme = useTheme()
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')
    const hideModal = () => setModalVisible(false)

    const handleCategoryPick = category => {
        setSelectedCategory(category)
        onCategoryPicked(category)
        hideModal()
    }

    const getIconName = (category: string) => {
        switch (category) {
            case 'Auto':
                return 'car'
            case 'Smartphone':
                return 'phone-portrait'
            case 'Laptop':
                return 'laptop'
            case 'Fiets':
                return 'bicycle'
            default:
                return 'apps'
        }
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
                    <Ionicons
                        name={getIconName(selectedCategory)}
                        size={20}
                        style={[styles.icon, {color: theme.colors.onSurface}]}
                    />
                    <Text style={[styles.text, {color: theme.colors.onSurface}]}>
                        {selectedCategory || 'Selecteer categorie'}
                    </Text>
                </View>
            </TouchableWithoutFeedback>

            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={hideModal}
                    contentContainerStyle={[styles.modal, {backgroundColor: theme.colors.primary}]}>
                    <View style={styles.categoriesContainer}>
                        {Object.values(ICategories).map(category => (
                            <Text
                                key={category}
                                style={styles.categoryText}
                                onPress={() => handleCategoryPick(category)}>
                                {category}
                            </Text>
                        ))}
                    </View>
                </Modal>
            </Portal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        padding: 15,
        marginVertical: 10,
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 16,
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    categoriesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        margin: 10,
    },
})

export default CategoryPicker
