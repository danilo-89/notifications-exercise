import { useState } from 'react'
import { QueryState, useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'

// Hooks
import { useNotificationsQuery } from '@/hooks/useNotificationsQuery'

// Requests
import { readAllNotifications } from '@/requests'

// Components
import LoaderDots from '../loaders/LoaderDots'
import NotificationsList from '../NotificationsList'

const NotificationsWrapper = () => {
    const queryClient = useQueryClient()
    const counts: QueryState<{ unseen: boolean }, Error> | undefined =
        queryClient.getQueryState(['counts'])

    const [showUnreadTab, setShowUnreadTab] = useState(false)

    const { isFetching, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useNotificationsQuery(showUnreadTab)

    const currentQuery = queryClient.getQueryState([
        'notifications',
        showUnreadTab ? 'unseen' : 'all',
    ])

    const { mutate, isPending: isMutatePending } = useMutation({
        mutationKey: ['read-all-notification'],
        mutationFn: readAllNotifications,
        onSuccess(responseData, variables, context) {
            console.log({ responseData })
            console.log({ context })

            // reset query for 'all' notifications query
            queryClient.resetQueries({
                queryKey: ['notifications', 'all'],
                exact: true,
            })

            // clear data cache for 'unseen' notifications query
            queryClient.removeQueries({
                queryKey: ['notifications', 'unseen'],
                exact: true,
            })

            setShowUnreadTab(false)

            queryClient.setQueryData(['counts'], () => {
                const countsData = responseData?.counts

                return countsData || { all: undefined, unseen: undefined }
            })
        },
    })

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
                        onClick={() => {
                            const isInvalidated = queryClient.getQueryState([
                                'notifications',
                                'all',
                            ])?.isInvalidated

                            if (isInvalidated) {
                                queryClient.removeQueries({
                                    queryKey: ['notifications', 'all'],
                                    exact: true,
                                })
                            }

                            setShowUnreadTab(false)
                        }}
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
                        onClick={() => {
                            const isInvalidated = queryClient.getQueryState([
                                'notifications',
                                'unseen',
                            ])?.isInvalidated

                            if (isInvalidated) {
                                queryClient.removeQueries({
                                    queryKey: ['notifications', 'unseen'],
                                    exact: true,
                                })
                            }
                            setShowUnreadTab(true)
                        }}
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
                <>
                    {currentQuery?.isInvalidated ? (
                        <div className="fixed  w-[25rem] text-center z-10 top-[11rem]">
                            <button
                                type="button"
                                className="bg-azure text-white text-sm py-2 px-4 rounded-full  opacity-90 hover:opacity-100 transition-opacity"
                                onClick={() => {
                                    queryClient.resetQueries({
                                        queryKey: ['notifications'],
                                        exact: false,
                                        type: 'active',
                                    })
                                }}
                            >
                                update available
                            </button>
                        </div>
                    ) : null}
                    <NotificationsList data={data} />
                </>
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
