import {FlashList} from '@shopify/flash-list'
import {FunctionComponent, useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'

import {useDeleteItem, useGetItemsByUserId} from '@/api/items'
import ItemForm from '@/components/Items/itemFormModal'
import SwipableCardItem from '@/components/Items/swipableCardItem'
import IItem from '@/models/IItem'

interface MijnItemsProps {}

const MijnItems: FunctionComponent<MijnItemsProps> = () => {
    const {data: items} = useGetItemsByUserId()
    const deleteItemMutation = useDeleteItem()
    const [activeCardId, setActiveCardId] = useState<string | null>(null)
    const [editItemId, setEditItemId] = useState<string | null>(null)
    const [refresh, setRefresh] = useState(0)

    const actionButtons = (itemId: string) => [
        {
            icon: 'delete',
            onPress: () => deleteItemMutation.mutate({id: itemId}),
            backgroundColor: 'red',
        },
        {
            icon: 'flash',
            onPress: () => {
                console.log('edit item:', itemId)
                console.log('onPress is uitgevoerd')
                setEditItemId(itemId)
            },
            backgroundColor: 'lightblue',
        },
    ]

    useEffect(() => {
        console.log('editItemId is veranderd')
        setRefresh(prevState => prevState + 1)
    }, [editItemId])

    return (
        <>
            <View style={styles.container}>
                <FlashList
                    data={items}
                    estimatedItemSize={150}
                    renderItem={({item}: {item: IItem}) => (
                        <SwipableCardItem
                            title={item.itemTitle}
                            {...item}
                            onPress={() => setActiveCardId(item.id!)}
                            actionButtons={actionButtons(item.id!)}
                        />
                    )}
                    keyExtractor={item => item.id!.toString()}
                />
            </View>
            {activeCardId && (
                <ItemForm
                    itemId={activeCardId}
                    onhide={() => setActiveCardId(null)}
                />
            )}
            {editItemId && (
                <ItemForm
                    itemId={editItemId}
                    onhide={() => setEditItemId(null)}
                />
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

export default MijnItems
