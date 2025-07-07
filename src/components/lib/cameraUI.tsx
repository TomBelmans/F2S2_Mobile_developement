import {CameraRoll} from '@react-native-camera-roll/camera-roll'
import {FunctionComponent, useEffect, useRef, useState} from 'react'
import {Linking, Modal, StyleSheet, View} from 'react-native'
import {IconButton, Snackbar, TouchableRipple, useTheme} from 'react-native-paper'
import {Camera, PhotoFile, useCameraDevice, useCameraPermission} from 'react-native-vision-camera'

import changeRgbaOpacity from '@/utils/changeRgbaOpacity'

interface CameraUIProps {
    showCamera: boolean
    cameraType: 'front' | 'back'
    onClose: (path: PhotoFile | undefined) => void
    onPictureTaken: (image: string) => void
}

const iconSize = 30

const CameraUI: FunctionComponent<CameraUIProps> = ({showCamera, cameraType, onClose, onPictureTaken}) => {
    const theme = useTheme()

    // Vraag een referentie op naar de gewenste camera, de gebruiker kan deze switchen.
    const [activeCamera, setActiveCamera] = useState<'front' | 'back'>(cameraType === 'front' ? 'front' : 'back')
    // De informatie over het device kan gebruikt worden om informatie zoals de mogelijke formaten, zoom niveaus, ...
    // op te vragen.
    const cameraDevice = useCameraDevice(activeCamera)

    // Via useRef kunnen we camera aanspreken om een foto te nemen, een video opname te starten of te stoppen, ...
    const camera = useRef<Camera>(null)

    // Het is, voor veel modules, nodig dat we toestemming vragen aan de gebruiker om bepaalde acties uit te voeren.
    // Dit doe je best niet als je app start maar pas wanneer de gebruiker de actie uitvoert die de toestemming nodig
    // heeft.
    const {hasPermission: hasCameraPermission, requestPermission: requestCameraPermission} = useCameraPermission()
    const [requestedPermission, setRequestedPermission] = useState<boolean>(false)

    useEffect(() => {
        if (showCamera && !hasCameraPermission) {
            requestCameraPermission().then(() => setRequestedPermission(true))
        }
    }, [showCamera, hasCameraPermission])

    // Toon niets als de camera verborgen is of als er nog geen rechten zijn aangevraagd.
    if (!showCamera || (!requestedPermission && !hasCameraPermission)) {
        return <></>
    }

    // Als de rechten aangevraagd zijn en deze niet toegekend zijn, wordt er een foutmelding getoond.
    if (requestedPermission && !hasCameraPermission) {
        return (
            <Snackbar
                action={{
                    label: 'Grant',
                    // Via Linking.openSettings kan de gebruiker naar de instellingen van de app gaan om de rechten
                    // aan te passen.
                    // Dit is een standaard functie die door het React Native voorzien wordt, er zijn dus geen extra
                    // libraries nodig.
                    onPress: () => Linking.openSettings(),
                }}
                onDismiss={() => {}}
                visible>
                We need to be granted permission to use the camera, otherwise the app is unable to function. Please
                grant us permission and try again.
            </Snackbar>
        )
    }

    // Het is mogelijk dat het toestel geen camera heeft, in dat geval gooien we hier een error naar boven,
    // het is properder om hier ook een gepaste melding voor te tonen, dit laten we als oefening.
    if (!cameraDevice) {
        throw new Error(`No ${activeCamera} camera detected.`)
    }

    return (
        <Modal>
            <View style={[styles.cameraContainer]}>
                <Camera
                    ref={camera}
                    style={[styles.absoluteFill]}
                    device={cameraDevice!}
                    isActive
                    photo
                    enableZoomGesture
                />

                <IconButton
                    icon="close"
                    style={[styles.closeButton, {backgroundColor: theme.colors.surface}]}
                    onPress={() => onClose(undefined)}
                    iconColor={theme.colors.onSurface}
                    size={iconSize}
                />

                <IconButton
                    icon="camera-flip"
                    style={[styles.switchButton, {backgroundColor: theme.colors.surface}]}
                    iconColor={theme.colors.onSurface}
                    onPress={() => setActiveCamera(c => (c === 'front' ? 'back' : 'front'))}
                    size={iconSize}
                />

                {/**
                 * De TouchableRipple component kan gebruikt worden om een visuele indicatie te geven als de
                 * gebruiker ergens op drukt, dit is een alternatief voor een klassieke button dat voorzien
                 * wordt in React Native Paper.
                 **/}
                <TouchableRipple
                    onPress={async () => {
                        // De foto's die genomen worden door VisionCamera worden bewaard in de cache, dit is geen goede
                        // plaats om foto's te bewaren omdat deze cache opgeruimd kan worden door het OS.
                        // Dit gebeurd in het geval dat er te weinig opslagruimte beschikbaar is op het toestel.
                        const photo = await camera.current?.takePhoto()

                        // Als alternatief gebruiken we de CameraRoll module om de foto op te slaan in de galerij.
                        if (photo) {
                            // Merk op dat we de file:// prefix toevoegen aan de path, dit is nodig elke keer dat we
                            // met bestanden willen werken op het bestandsysteem van het mobiele toestel.
                            const galleryPhoto = await CameraRoll.saveAsset(photo.path, {type: 'photo'})
                            onClose(photo ? {...photo, path: galleryPhoto.node.image.uri} : undefined)
                            if (onPictureTaken) {
                                onPictureTaken(galleryPhoto.node.image.uri)
                            }
                        }
                        onClose(undefined)
                    }}
                    style={[
                        styles.actionButton,
                        {
                            borderColor: theme.colors.outlineVariant,
                            backgroundColor: changeRgbaOpacity(theme.colors.surface, 0.5),
                        },
                    ]}
                    centered
                    background={{radius: 40}}>
                    <View />
                </TouchableRipple>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    absoluteFill: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    actionButton: {
        borderWidth: 2,
        height: 80,
        width: 80,
        borderRadius: 50,
        bottom: 20,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 40,
    },
    switchButton: {
        position: 'absolute',
        right: 20,
        bottom: 30,
    },
    cameraContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
})
export default CameraUI
