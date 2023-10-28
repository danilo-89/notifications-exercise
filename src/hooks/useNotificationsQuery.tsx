import { useEffect } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

// Requests
import { getNotifications } from '@/requests'

// Hooks
import { useNotificationsUpdateContext } from './useNotificationsUpdateContext'

export const useNotificationsQuery = (unseen = false, enabled = true) => {
    const queryClient = useQueryClient()
    const { setNewNotifications } = useNotificationsUpdateContext()

    const queryData = useInfiniteQuery({
        enabled,
        queryKey: ['notifications', unseen ? 'unseen' : 'all'],
        queryFn: ({ pageParam }) => getNotifications(pageParam, unseen),
        initialPageParam: 1,
        initialData: undefined,
        staleTime: Infinity,
        retry: 3,
        retryDelay() {
            return 2000
        },
        getNextPageParam: (lastPage) => {
            return Number(lastPage?.meta?.next?._page) || undefined
        },
    })

    useEffect(() => {
        if (queryData?.data) {
            queryClient.setQueryData(['counts'], () => {
                const counts = queryData.data?.pages?.[0]?.counts
                return counts || { all: undefined, unseen: undefined }
            })
        }
    }, [queryData?.data, queryClient])

    // setting newNotifications to 0 when query is refetched
    useEffect(() => {
        if (queryData?.data && queryData.data?.pageParams.length === 1) {
            setNewNotifications(0)
        }
    }, [queryData.data, setNewNotifications])

    return queryData
}
