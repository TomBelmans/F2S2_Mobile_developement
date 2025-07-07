import React, {ComponentProps, FunctionComponent, useState} from 'react'
import {View, StyleSheet, useWindowDimensions} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import {IconButton, List} from 'react-native-paper'
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated'

import CardItem from '@/components/Items/cardItem'
import IItem from '@/models/IItem'

const actionButtonWidth = 80

interface ActionButton extends ComponentProps<typeof IconButton> {
    onPress: () => void
    backgroundColor?: string
}

interface SwipableCardItemProps extends IItem, ComponentProps<typeof List.Item> {
    actionButtons: ActionButton[]
}

const SwipableCardItem: FunctionComponent<SwipableCardItemProps> = ({onPress, actionButtons, ...i}) => {
    const [activeCardId, setActiveCardId] = useState<string | null>(null)
    const isOpen = useSharedValue<boolean>(false)
    const offset = useSharedValue<number>(0)

    const dim = useWindowDimensions()

    const numberOfActionButtons = actionButtons ? actionButtons.length : 0
    const actionButtonsWidth = actionButtonWidth * numberOfActionButtons

    const listItemStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: offset.value}],
        }
    })

    const iconStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: Math.max(offset.value, -actionButtonsWidth)}],
        }
    })

    const gesture = Gesture.Pan()
        .onUpdate(e => {
            // Een negatieve waarde op de x-as betekent dat het element naar links versleept wordt.
            // We willen enkel een translatie naar links toestaan als het menu nog niet open is.
            if (e.translationX < 0 && !isOpen.value) {
                offset.value = e.translationX
            }
        })
        .onEnd(e => {
            // Als het menu open is, moet het gesloten worden met een swipe naar rechts.
            if (isOpen.value) {
                // Links is een negatieve translatie, rechts een positieve.
                if (e.translationX > 0) {
                    // withTiming is een functie uit Reanimated die een animatie start die over een tijdsinterval beweegt
                    // naar de opgegeven waarde.
                    // Via een optionele tweede parameter kan het tijdsinterval van de animatie ingesteld worden.
                    offset.value = withTiming(0)
                    isOpen.value = false
                }
            } else {
                if (-1 * e.translationX > dim.width / 3) {
                    // We zetten het menu vast zodat er rechts juist ruimte over is voor de actieknoppen.
                    offset.value = withTiming(-actionButtonsWidth)
                    isOpen.value = true
                } else {
                    // Als niet minstens 1/3 van het de schermbreedte geswiped is, zetten we de knoppen terug op de
                    // begintoestand.
                    offset.value = withTiming(0)
                }
            }
        })

        // Zonder deze optie is het niet mogelijk om door de lijst te scrollen.
        // Door een minimale horizontale verplaatsing van 10 te eisen, wordt het gesture niet geactiveerd voor verticale
        // bewegingen.
        // In dat geval wordt het gesture doorgegeven naar de bovenliggende component, i.e. de FlatList.
        .activeOffsetX([-10, 10])

    return (
        <GestureDetector gesture={gesture}>
            <View>
                {/**
                 * Als er animated style gebruikt wordt, moet deze omringd worden door een Animated.View,
                 * Animated.FlatList, Animated.Image, Animated.ScrollView of Animated.Text component.
                 **/}
                <Animated.View style={[styles.container, listItemStyle]}>
                    <CardItem
                        {...i}
                        onPress={() => setActiveCardId(i.id!)}
                    />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            width: actionButtonsWidth,
                            right: -actionButtonsWidth,
                        },
                        iconStyle,
                    ]}>
                    {actionButtons &&
                        actionButtons.map(({onPress, ...rest}, i) => (
                            <IconButton
                                key={i}
                                style={[styles.icon, {backgroundColor: rest.backgroundColor}]}
                                {...rest}
                                onPress={() => {
                                    onPress()
                                    offset.value = withTiming(0)
                                }}
                                size={25}
                            />
                        ))}
                </Animated.View>
            </View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
    },
    iconContainer: {
        position: 'absolute',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    icon: {
        width: actionButtonWidth,
        height: '100%',
        borderRadius: 0,
        margin: 0,
    },
})

export default SwipableCardItem
