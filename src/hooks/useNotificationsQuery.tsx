import { useEffect } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

// Requests
import { getNotifications } from '@/requests'

export const useNotificationsQuery = (unseen = false, enabled = true) => {
    const queryClient = useQueryClient()

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

    return queryData
}
