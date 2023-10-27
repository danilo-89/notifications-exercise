import { useMutationState } from '@tanstack/react-query'
import formatDistance from 'date-fns/formatDistance'

// Hooks
import { useNotificationMutationContext } from '@/hooks/useNotificationMutationContext'

// Assets
import avatarPlaceholderImg from '@/assets/avatar-placeholder.png'

// Components
import Spinner from '../loaders/Spinner'

// Types
import { Notification } from '@/types/api'

interface IProps {
    item: Notification
}

const NotificationItem = ({ item }: IProps) => {
    const { mutate } = useNotificationMutationContext()!

    const variables = useMutationState({
        filters: {
            mutationKey: ['read-single-notification'],
            predicate: (mutation) => {
                console.log(mutation)
                return mutation.state.variables === item.id
            },
        },
    })

    const notificationState = variables[0] || {}

    return (
        <li className="relative z-10 flex border-b border-[#DCDEE4]/50 py-4 pl-6 pr-4 text-xs">
            {item.user ? (
                <img
                    className="bg-orange-300 mr-3 h-[2.125rem] w-[2.125rem] flex-shrink-0 rounded-full"
                    src={avatarPlaceholderImg}
                    alt="avatar placeholder"
                />
            ) : null}
            <div className="text-slateGray">
                <div className="mb-1">{item.body}</div>
                <div>
                    {formatDistance(item.createdAt, new Date(), {
                        addSuffix: true,
                    })}
                </div>
            </div>
            <div className="ml-auto">
                {!item.seen && notificationState.status !== 'success' ? (
                    <>
                        {notificationState.status === 'pending' ? (
                            <Spinner />
                        ) : (
                            <button
                                onClick={() => mutate(item.id)}
                                className="ml-2 inline-block h-3.5 w-3.5 rounded-full bg-azure"
                            />
                        )}
                    </>
                ) : null}
            </div>
        </li>
    )
}

export default NotificationItem
