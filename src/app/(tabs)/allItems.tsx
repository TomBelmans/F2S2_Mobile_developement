import {FlashList} from '@shopify/flash-list'
import {FunctionComponent, useState} from 'react'
import {StyleSheet, View} from 'react-native'

import {useGetItems} from '@/api/items'
import CardItem from '@/components/Items/cardItem'
import ItemCard from '@/components/Items/itemCardModal'

interface AllItemsProps {}

const AllItems: FunctionComponent<AllItemsProps> = () => {
    const {data: items} = useGetItems()
    const [activeCardId, setActiveCardId] = useState<string | null>(null)

    return (
        <>
            <View style={styles.container}>
                <FlashList
                    data={items}
                    estimatedItemSize={150}
                    renderItem={({item}) => (
                        <CardItem
                            {...item}
                            onPress={() => setActiveCardId(item.id!)}
                        />
                    )}
                    keyExtractor={item => item.id!.toString()}
                />
            </View>
            {activeCardId && (
                <ItemCard
                    itemId={activeCardId}
                    onhide={() => setActiveCardId(null)}
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

export default AllItems
