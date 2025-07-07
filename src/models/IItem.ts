import {ICategories} from '@/models/ICategories'

interface IItem {
    id?: string
    itemTitle: string
    itemDescription: string
    price: string
    image: string
    date: number
    userId: string
    category: ICategories
}

export default IItem
