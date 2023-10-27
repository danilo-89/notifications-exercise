import { useContext } from 'react'

// Context
import { NotificationMutationContext } from '@/contexts/NotificationMutationContext'

export const useNotificationMutationContext = () => {
    const context = useContext(NotificationMutationContext)

    // error handling (if component is not inside context provider)
    if (context === undefined) {
        throw new Error(
            'useNotificationMutationContext must be used inside a NotificationMutationContextProvider'
        )
    }

    return context
}
