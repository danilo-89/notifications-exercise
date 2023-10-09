import { useEffect } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'

// Requests
import { getNotifications } from '@/requests'

// const { isPending, error, data, fetchNextPage, hasNextPage, hasPreviousPage } =
//     useInfiniteQuery({
//         queryKey: ['notifications'],
//         queryFn: ({ pageParam }) => getNotifications(pageParam),
//         initialPageParam: 1,
//         staleTime: Infinity,
//         getNextPageParam: (lastPage, allPages, lastPageParam) => {
//             console.log({ lastPageParam })
//             console.log('next', Number(lastPage?.meta?.next?._page))
//             return Number(lastPage?.meta?.next?._page) || undefined
//         },
//     })

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
        retryDelay(failureCount, error) {
            return 2000
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            console.log({ lastPageParam })
            console.log('next', Number(lastPage?.meta?.next?._page))
            return Number(lastPage?.meta?.next?._page) || undefined
        },
    })

    useEffect(() => {
        if (queryData?.data) {
            queryClient.setQueryData(['counts'], (currentData) => {
                console.log(queryData.data)

                console.log('test', queryData.data)

                const counts = queryData.data?.pages?.[0]?.counts

                return { ...counts } || { all: undefined, unseen: undefined }
            })
        }
    }, [queryData?.data, queryClient])

    return queryData
}
