import { useNotificationsQuery } from '@/hooks/useNotificationsQuery'
import { getNotifications, readAllNotifications } from '@/requests'
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'
import NotificationItem from '../NotificationItem'

const NotificationsList = () => {
    // const queryClient = useQueryClient()
    const queryClient = useQueryClient()

    const counts = queryClient.getQueryState(['counts'])
    // const queryData = queryClient.getQueryData(['notifications'])

    const [showUnread, setShowUnread] = useState(false)

    const {
        isPending,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
    } = useNotificationsQuery(showUnread)

    console.log({ counts })

    const { mutate } = useMutation({
        mutationKey: ['read-all-notification'],
        mutationFn: readAllNotifications,
        onSuccess(responseData, variables, context) {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                refetchType: 'none',
            })
            // queryClient.resetQueries({ queryKey: ['notifications'] })
            setShowUnread(false)
            // queryClient.removeQueries({ queryKey: ['notifications'] })
        },
    })

    // const sdfdsfs = queryClient.fetchInfiniteQuery

    // console.log({ sdfdsf })
    // const {
    //     isPending,
    //     error,
    //     data,
    //     fetchNextPage,
    //     hasNextPage,
    //     hasPreviousPage,
    // } = useInfiniteQuery(['notifications'], getNotifications)

    // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    //     useInfiniteQuery({
    //         queryKey: ['projects'],
    //         queryFn: ({ pageParam }) => getNotifications(pageParam),
    //         initialPageParam: 1,
    //         getNextPageParam: (lastPage, allPages, lastPageParam) => {
    //             console.log({ lastPageParam })
    //             console.log('next', Number(lastPage?.meta?.next?._page))
    //             return Number(lastPage?.meta?.next?._page) || undefined
    //         },
    //     })

    // console.log({ queryState })
    // console.log({ queryData })
    // console.log(data)

    return (
        <div className="fixed right-0 top-[5.75rem] max-h-[90vh] overflow-auto w-[25rem] z-10 bg-white">
            <div>
                <div className="flex justify-between">
                    <div>
                        <span>Inbox</span>
                        <span>{counts?.data?.unseen}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => mutate()}
                    >
                        Mark all as read
                    </button>
                </div>
                <div className="flex">
                    <button
                        type="button"
                        onClick={() => setShowUnread(false)}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowUnread(true)}
                    >
                        Unread
                    </button>
                </div>
            </div>
            <ul>
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group?.data?.map((item) => (
                            <NotificationItem
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </Fragment>
                ))}
            </ul>
            <button
                onClick={() => {
                    fetchNextPage()
                }}
            >
                Load More
            </button>
        </div>
    )
}

export default NotificationsList
