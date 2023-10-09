import { Fragment, useEffect, useState } from 'react'
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query'
import clsx from 'clsx'

// Hooks
import { useNotificationsQuery } from '@/hooks/useNotificationsQuery'

// Requests
import { getNotifications, readAllNotifications } from '@/requests'

// Components
import NotificationItem from '../NotificationItem'
import LoaderDots from '../loaders/LoaderDots'
import NotificationsList from '../NotificationsList'

const NotificationsWrapper = () => {
    // const queryClient = useQueryClient()
    const queryClient = useQueryClient()

    // console.log('cache', queryClient.getQueryData(['notifications', null]))

    const counts = queryClient.getQueryState(['counts'])
    // const queryData = queryClient.getQueryData(['notifications'])

    const [showUnreadTab, setShowUnreadTab] = useState(false)

    // const nt = queryClient.getQueryState([
    //     'notifications',
    //     showUnreadTab ? 'unseen' : 'all',
    // ])

    const {
        isFetching,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
        isFetchingNextPage,
        status,
        isStale,
        refetch,
    } = useNotificationsQuery(showUnreadTab)

    // queryClient.is

    console.log({ counts })
    console.log('find params', data)
    console.log({ status })
    console.log({ isStale })

    // useEffect(() => {
    //     if (nt?.isInvalidated) {
    //         queryClient.resetQueries({
    //             queryKey: ['notifications'],
    //             exact: false,
    //             type: 'active',
    //         })
    //         refetch()
    //     }
    //     // queryClient.ensureQueryData({ queryKey: ['notifications', null] })
    //     // return () => {
    //     //     if (isStale) {
    //     //         queryClient.setQueriesData(
    //     //             { queryKey: ['notifications'], exact: false },
    //     //             (currentData) => {
    //     //                 console.log({ currentData })
    //     //                 if (currentData) {
    //     //                     return { pages: [], pageParams: [1] }
    //     //                 }
    //     //                 return currentData
    //     //             }
    //     //         )
    //     //     }
    //     // }
    // }, [nt?.isInvalidated, queryClient, refetch])

    // 'single-notifications-state'

    const {
        mutate,
        isPending: isMutatePending,
        isSuccess,
    } = useMutation({
        mutationKey: ['read-all-notification'],
        mutationFn: readAllNotifications,
        onSuccess(responseData, variables, context) {
            console.log({ responseData })
            console.log({ context })

            queryClient.invalidateQueries({
                queryKey: ['notifications', 'unseen'],
                refetchType: 'none',
                exact: true,
            })

            queryClient.resetQueries({
                queryKey: ['notifications', 'all'],
                exact: true,
            })

            setShowUnreadTab(false)

            queryClient.setQueryData(['counts'], (currentData) => {
                const counts = responseData?.counts

                return counts || { all: undefined, unseen: undefined }
            })
            // queryClient.removeQueries({ queryKey: ['notifications'] })
        },
    })

    // useEffect(() => {
    //     if (isSuccess) {
    //         queryClient.resetQueries({
    //             queryKey: ['notifications', null],
    //             exact: true,
    //         })
    //     }
    // }, [isSuccess, queryClient])

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

    const unseenCount = counts?.data?.unseen

    return (
        <div
            className="fixed right-0 top-[4.5rem] z-10 max-h-[90vh] w-[25rem] overflow-auto rounded-b-lg bg-white [box-shadow:0px_0px_0px_0px_rgba(0,_0,_0,_0.06),_0px_3px_6px_0px_rgba(0,_0,_0,_0.06),_0px_10px_10px_0px_rgba(0,_0,_0,_0.05),_0px_23px_14px_0px_rgba(0,_0,_0,_0.03),_0px_41px_17px_0px_rgba(0,_0,_0,_0.01)]
        "
        >
            <div
                className="rounded-t-lg
bg-white [box-shadow:0px_0px_0px_0px_rgba(0,_0,_0,_0.04),_0px_1px_2px_0px_rgba(0,_0,_0,_0.04),_0px_3px_3px_0px_rgba(0,_0,_0,_0.03),_0px_7px_4px_0px_rgba(0,_0,_0,_0.02)]"
            >
                <div className="flex justify-between py-4 pl-6 pr-4">
                    <div className="flex">
                        <span className="mr-1.5 font-semibold">Inbox</span>
                        {typeof unseenCount === 'string' && +unseenCount > 0 ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-azure text-xs text-white">
                                {unseenCount}
                            </span>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={() => mutate()}
                        className={`text-xs font-medium ${
                            isMutatePending ? 'text-night' : 'text-azure'
                        }`}
                        disabled={isMutatePending}
                    >
                        Mark all as read
                    </button>
                </div>
                <div className="flex pl-6 pr-4">
                    <button
                        type="button"
                        onClick={() => setShowUnreadTab(false)}
                        className={clsx(
                            'h-[2.125rem] relative inline-block px-3 text-xs mr-6 font-medium',
                            !showUnreadTab &&
                                "text-azure after:content-[''] after:h-0.5 after:w-full after:bg-azure after:absolute after:left-0 after:bottom-0"
                        )}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowUnreadTab(true)}
                        className={clsx(
                            'h-[2.125rem] relative inline-block px-3 text-xs font-medium',
                            showUnreadTab &&
                                "text-azure after:content-[''] after:h-0.5 after:w-full after:bg-azure after:absolute after:left-0 after:bottom-0"
                        )}
                    >
                        Unread
                    </button>
                </div>
            </div>
            {isFetching && !isFetchingNextPage ? (
                <div className="text-center p-5 pt-12 text-slateGray text-sm">
                    Loading notifications
                    <LoaderDots />
                </div>
            ) : (
                <NotificationsList data={data} />
            )}
            <div className="flex h-8 items-center justify-center rounded-b-lg">
                {hasNextPage && !(isFetching && !isFetchingNextPage) ? (
                    <button
                        className={`text-xs font-medium ${
                            isFetchingNextPage ? 'text-night' : 'text-azure'
                        }`}
                        disabled={isFetchingNextPage}
                        onClick={() => {
                            fetchNextPage()
                        }}
                    >
                        {isFetchingNextPage ? (
                            <>
                                Loading
                                <LoaderDots />
                            </>
                        ) : (
                            'Load More'
                        )}
                    </button>
                ) : null}
            </div>
        </div>
    )
}

export default NotificationsWrapper
