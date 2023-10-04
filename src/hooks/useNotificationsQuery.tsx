import { getNotifications } from '@/requests'
import { useInfiniteQuery } from '@tanstack/react-query'

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

export const useNotificationsQuery = (unseen = false) =>
    useInfiniteQuery({
        queryKey: ['notifications', unseen ? 'unseen' : null],
        queryFn: ({ pageParam }) => getNotifications(pageParam, unseen),
        initialPageParam: 1,
        staleTime: Infinity,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            console.log({ lastPageParam })
            console.log('next', Number(lastPage?.meta?.next?._page))
            return Number(lastPage?.meta?.next?._page) || undefined
        },
    })
