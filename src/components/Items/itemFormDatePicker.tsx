import {useTheme} from '@react-navigation/native'
import {Dispatch, FunctionComponent, SetStateAction, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {Button, Text} from 'react-native-paper'

import DateTimePickerNative from '@/components/lib/dateTimePicker'

interface ItemFormDatePickerProps {
    date: Date | undefined
    setDate: Dispatch<SetStateAction<Date | undefined>>
}

const ItemFormDatePicker: FunctionComponent<ItemFormDatePickerProps> = ({date, setDate}) => {
    const theme = useTheme()
    const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false)

    return (
        <>
            <View style={[styles.datePicker, {borderColor: theme.colors.border, borderWidth: 1}]}>
                <Text>{date?.toLocaleString() ?? 'No date selected'}</Text>
                <Button onPress={() => setShowDateTimePicker(true)}>Choose date</Button>
            </View>

            <DateTimePickerNative
                show={showDateTimePicker}
                onClose={() => setShowDateTimePicker(false)}
                onSelected={setDate}
            />
        </>
    )
}

const styles = StyleSheet.create({
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
})
export default ItemFormDatePicker
