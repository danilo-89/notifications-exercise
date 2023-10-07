import { readSingleNotification } from '@/requests'
import {
    useIsMutating,
    useMutation,
    useMutationState,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'

import avatarPlaceholderImg from '@/assets/avatar-placeholder.png'
import Spinner from '../loaders/Spinner'
import formatDistance from 'date-fns/formatDistance'

const NotificationItem = ({ item }) => {
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationKey: ['read-single-notification', item.id],
        mutationFn: () => readSingleNotification(item.id),
        onMutate(variables) {
            console.log({ variables })
            queryClient.setQueriesData(
                { queryKey: ['single-notifications-state'] },
                (data) => {
                    console.log(data)
                    return {
                        ...data,
                        [item.id]: {
                            pending: true,
                        },
                    }
                }
            )
        },
        onSuccess(responseData, variables, context) {
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

            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                refetchType: 'none',
            })

            queryClient.setQueryData(['counts'], (currentData) => {
                const counts = responseData?.counts

                return counts || { all: undefined, unseen: undefined }
            })

            console.log(responseData)

            console.log('still executes')
            // queryClient.resetQueries({ queryKey: ['notifications'] })
            // setShowUnread(false)
            // // queryClient.removeQueries({ queryKey: ['notifications'] })
        },
        onSettled(data, error, variables, context) {
            queryClient.setQueriesData(
                { queryKey: ['single-notifications-state'] },
                (stateData) => {
                    console.log({ data })
                    console.log({ stateData })
                    return {
                        ...stateData,
                        [item.id]: {
                            pending: false,
                            seen: data?.data?.seen || false,
                        },
                    }
                }
            )
        },
    })

    // console.log(queryClient.getQueryState(['single-notifications-state']))
    const state = queryClient.getQueryData(['single-notifications-state'])
    const itemState = state?.[item.id] || {}

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
