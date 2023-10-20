import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
} from 'react'

interface IProps {
    newNotifications: number
    setNewNotifications: Dispatch<SetStateAction<number>> | (() => void)
}

export const NotificationsUpdateContext = createContext<IProps>({
    newNotifications: 0,
    setNewNotifications: () => null,
})

export function NotificationsUpdateContextProvider({
    children,
}: {
    children: ReactNode
}) {
    const [newNotifications, setNewNotifications] = useState(0)

    return (
        <NotificationsUpdateContext.Provider
            value={{ newNotifications, setNewNotifications }}
        >
            {children}
        </NotificationsUpdateContext.Provider>
    )
}
