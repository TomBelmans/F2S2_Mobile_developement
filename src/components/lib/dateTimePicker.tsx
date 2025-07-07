import DateTimePickerLib, {DateTimePickerEvent} from '@react-native-community/datetimepicker'
import {FunctionComponent, useEffect, useRef, useState} from 'react'

interface DateTimePickerProps {
    show: boolean
    onClose: () => void
    onSelected: (dateTime: Date) => void
}

const DateTimePicker: FunctionComponent<DateTimePickerProps> = ({show, onClose, onSelected}) => {
    const [mode, setMode] = useState<'time' | 'date'>('date')
    const tmpDate = useRef<Date | undefined>(undefined)
    const done = useRef<boolean>(false)

    const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        // Als de picker gesloten is via de 'cancel' knop, moet er verder niets gebeuren.
        if (event.type === 'dismissed') {
            onClose()
            return
        }

        // Als de datum gekozen is moet vervolgens de time picker getoond worden.
        if (mode === 'date') {
            tmpDate.current = selectedDate
            setMode('time')
        } else {
            // Als de tijd gekozen is, kunnen de datum en tijd samen gevoegd worden tot één Date object dat zowel de
            // datum als tijd bevat.
            const dateDate = tmpDate.current as Date
            const timeDate = selectedDate as Date

            const newDate = new Date(
                dateDate.getFullYear(),
                dateDate.getMonth(),
                dateDate.getDate(),
                timeDate.getHours(),
                timeDate.getMinutes(),
            )

            // De onSelected en onClose functies kunnen een re-render trigger.
            // Via deze ref wordt vermeden dat de time picker een tweede keer getoond wordt.
            done.current = true

            onSelected(newDate)
            onClose()
        }
    }

    useEffect(() => {
        if (!show) {
            // Als de picker verborgen wordt, moet alles gereset worden zodat de picker opnieuw gebruikt kan worden.
            tmpDate.current = undefined
            done.current = false
            setMode('date')
        }
    }, [show])

    if (!show || done.current) {
        return <></>
    }

    return (
        <DateTimePickerLib
            value={new Date()}
            mode={mode}
            is24Hour
            onChange={onChange}
        />
    )
}

export default DateTimePicker
