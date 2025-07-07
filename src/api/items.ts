import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import {useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query'

import {getCurrentUser} from '@/api/auth'
import {
    documentData,
    getCollectionRef,
    getDataFromDocumentSnapshot,
    getDataFromQuerySnapshot,
    getDocumentRef,
} from '@/api/firestoreUtils'
import {ICategories} from '@/models/ICategories'
import IItem from '@/models/IItem'

//region Mutations & queries

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          MUTATIONS & QUERIES
 * ---------------------------------------------------------------------------------------------------------------------
 */

export const useGetItems = (): UseQueryResult<IItem[], Error> => {
    return useQuery({
        queryKey: ['items'],
        queryFn: getItems,
    })
}

export const useGetItemById = (itemId: string): UseQueryResult<IItem | undefined, Error> => {
    return useQuery({
        queryKey: ['items', itemId],
        queryFn: () => getItemById(itemId),
    })
}

export const useGetItemsByUserId = (): UseQueryResult<IItem[], Error> => {
    return useQuery({
        queryKey: ['items', ''],
        queryFn: () => getItemsByUserId(),
    })
}

export const useAddItem = (): UseMutationResult<IItem, Error, AddItemParams, void> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addItem,
        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['items']})
        },
    })
}

export function useUploadImageToFirebase(): UseMutationResult<string, Error, UploadImageParams> {
    return useMutation({
        mutationFn: uploadImageToFirebase,
    })
}

export const useDeleteItem = (): UseMutationResult<void, Error, DeleteItemParams, void> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteItem,
        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['items']})
        },
    })
}

export const useUpdateItem = (): UseMutationResult<IItem, Error, IItem & {id: string}, void> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateItem,
        onSettled: async () => {
            await queryClient.invalidateQueries({queryKey: ['items']})
        },
        onError: (error, variables) => {
            console.error('Error updating item:', error, variables)
        },
    })
}

//endregion

//region API functions

/**
 * ---------------------------------------------------------------------------------------------------------------------
 *                                          API functions
 * ---------------------------------------------------------------------------------------------------------------------
 */

const getItems = async (): Promise<IItem[]> => {
    const querySnapshot = await getCollectionRef<IItem>('items').orderBy('date', 'desc').get()
    return getDataFromQuerySnapshot(querySnapshot, 'id')
}

const getItemById = async (itemId: string): Promise<IItem | undefined> => {
    return documentData<IItem>('items', itemId, 'id')
}

const getItemsByUserId = async (): Promise<IItem[]> => {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
        throw new Error('User ID is required')
    }
    console.log('Fetching items for user:', currentUser.uid)

    try {
        const querySnapshot = await getCollectionRef<IItem>('items')
            .where('userId', '==', currentUser.uid)
            .orderBy('date', 'desc')
            .get()

        if (querySnapshot.empty) {
            console.log('No items found for user:', currentUser.uid)
            return []
        }

        const items = await getDataFromQuerySnapshot(querySnapshot, 'id')
        console.log('Fetched items:', items)
        return items
    } catch (error) {
        console.error('Error fetching items:', error)
        throw error
    }
}

interface AddItemParams {
    itemTitle: string
    itemDescription: string
    price: string
    image: string
    category: ICategories
}

const addItem = async (item: AddItemParams): Promise<IItem> => {
    const ref = getCollectionRef<IItem>('items')
    const user = auth().currentUser

    if (user === null) {
        throw new Error('User not found')
    }

    const newDocReference = await ref.add({
        ...item,
        date: Date.now(),
        userId: user.uid,
    })

    const querySnapshot = await newDocReference.get()

    // Aangezien we juist een insert gedaan hebben mogen we er van uit gaan dat de referentie verwijst naar een
    // bestaand document, anders had er een foutmelding opgegooid moeten worden.
    const newDoc = await getDataFromDocumentSnapshot<IItem>(querySnapshot, 'id')
    return newDoc as IItem
}

interface UploadImageParams {
    filename: string
}

const uploadImageToFirebase = async ({filename}: UploadImageParams): Promise<string> => {
    const ref = storage().ref(`images/demo.svg`)
    await ref.putFile(filename)
    return ref.getDownloadURL()
}

interface DeleteItemParams {
    id: string
}

const deleteItem = async ({id}: DeleteItemParams): Promise<void> => {
    await getDocumentRef<IItem>('items', id).delete()
}

const updateItem = async (message: IItem & {id: string}): Promise<IItem> => {
    console.log('Updating item:', message)
    const newData = {
        ...message,
        id: undefined,
    }

    delete newData.id
    await getDocumentRef('items', message.id).update(newData)
    return (await documentData('items', message.id, 'id')) as IItem
}

//endregion
