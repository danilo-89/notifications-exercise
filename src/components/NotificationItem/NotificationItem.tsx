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
        onMutate(variables) {
            console.log({ variables })
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
            // queryClient.setQueriesData(
            //     { queryKey: ['notifications'], exact: false },
            //     (currentData) => {
            //         console.log({ currentData })
            //         if (currentData) {
            //             return { ...currentData, pageParams: [1] }
            //         }
            //         return currentData
            //     }
            // )

            // Invalidate queries both for seen and unseen notifications
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                refetchType: 'none',
            })

            // Set counts based on response
            queryClient.setQueryData(['counts'], () => {
                const counts = responseData?.counts

                return { ...counts } || { all: undefined, unseen: undefined }
            })

            console.log(responseData)
        },
        onSettled(data) {
            if (data) {
                queryClient.setQueriesData(
                    { queryKey: ['single-notifications-state'] },
                    (stateData) => {
                        console.log({ data })
                        console.log({ stateData })
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

    // console.log(queryClient.getQueryState(['single-notifications-state']))
    const state:
        | { [key: string]: { seen: boolean; pending: boolean } }
        | undefined = queryClient.getQueryData(['single-notifications-state'])
    const itemState = state?.[item.id] || { seen: false, pending: false }

    // queryClient.getQueryState(['single-notifications-state'])
    // queryClient.getQueryData(['single-notifications-state'])
    // const data = useMutationState({
    //     filters: { mutationKey: ['read-single-notification', item.id] },
    //     select: (mutation) => mutation.state.data,
    // })

    // const isMutatingPosts = useIsMutating({
    //     mutationKey: ['read-single-notification', item.id],
    // })

    // console.log('ms', data)
    // console.log('isMutatingPosts', isMutatingPosts)

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
