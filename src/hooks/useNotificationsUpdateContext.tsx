import { NotificationsUpdateContext } from '@/contexts/NotificationsUpdateContext'
import { useContext } from 'react'

export const useNotificationsUpdateContext = () => {
    const context = useContext(NotificationsUpdateContext)

    // error handling (if component is not inside context provider)
    if (context === undefined) {
        throw new Error(
            'useNotificationsUpdateContext must be used inside a NotificationsUpdateContextProvider'
        )
    }

    return context
}
