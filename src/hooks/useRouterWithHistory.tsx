import {usePathname, useRouter} from 'expo-router'
import {Href} from 'expo-router/build/link/href'

const history: Href[] = []

const useRouterWithHistory = (): ReturnType<typeof useRouter> => {
    const router = useRouter()
    const pathName = usePathname()

    const back = () => {
        if (history.length > 0) {
            const x = history.pop() as Href
            router.navigate(x)
        } else {
            router.back()
        }
    }

    const navigate = (href: Href) => {
        history.push(pathName)
        router.navigate(href)
    }

    return {
        ...router,
        back,
        navigate,
    }
}

export default useRouterWithHistory
