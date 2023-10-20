import { useMutation, useQueryClient } from '@tanstack/react-query'
import formatDistance from 'date-fns/formatDistance'

// Requests
import { readSingleNotification } from '@/requests'

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
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationKey: ['read-single-notification', item.id],
        mutationFn: () => readSingleNotification(item.id),
        onMutate() {
            queryClient.setQueriesData(
                { queryKey: ['single-notifications-state'] },
                (data) => {
                    if (data) {
                        return {
                            ...data,
                            [item.id]: {
                                pending: true,
                            },
                        }
                    }
                }
            )
        },
        onSuccess(responseData) {
            // invalidate query for active notifications query
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                exact: false,
                type: 'active',
                refetchType: 'none',
            })
            // clear data cache for inactive notifications query
            queryClient.removeQueries({
                queryKey: ['notifications'],
                exact: false,
                type: 'inactive',
            })

            // Set counts based on response
            queryClient.setQueryData(['counts'], () => {
                const counts = responseData?.counts

                return (
                    { ...counts } || {
                        all: undefined,
                        unseen: undefined,
                    }
                )
            })
        },
        onSettled(data) {
            if (data) {
                queryClient.setQueriesData(
                    { queryKey: ['single-notifications-state'] },
                    (stateData) => {
                        if (stateData) {
                            return {
                                ...stateData,
                                [item.id]: {
                                    pending: false,
                                    seen: data?.data?.seen || false,
                                },
                            }
                        }
                    }
                )
            }
        },
    })

    const state:
        | { [key: string]: { seen: boolean; pending: boolean } }
        | undefined = queryClient.getQueryData(['single-notifications-state'])
    const itemState = state?.[item.id] || { seen: false, pending: false }

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
                {!item.seen && !itemState.seen ? (
                    <>
                        {itemState.pending ? (
                            <Spinner />
                        ) : (
                            <button
                                onClick={() => mutate()}
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
