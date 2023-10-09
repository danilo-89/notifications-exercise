import Form from '@/components/Form'
import Header from '@/components/Layout/Header'
import { useNotificationsQuery } from '@/hooks/useNotificationsQuery'
import { getNotifications } from '@/requests'
import { parseLinkHeader } from '@/utils/parseLinkHeader'
import {
    useInfiniteQuery,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const Home = () => {
    const queryClient = useQueryClient()

    // const { data, refetch } = useNotificationsQuery(false, false)

    useEffect(() => {
        // const queryData = queryClient.ensureQueryData({
        //     queryKey: ['notifications', 'all'],
        //     queryFn: async () => await getNotifications(1),
        // })
        const getInitialData = async () => {
            try {
                const response = await queryClient.fetchInfiniteQuery({
                    queryKey: ['notifications', 'all'],
                    initialPageParam: 1,
                    queryFn: async (pageParam) =>
                        await getNotifications(pageParam.pageParam),
                })

                queryClient.setQueryData(['counts'], (currentData) => {
                    console.log(response)

                    console.log('test', response)

                    const counts = response?.pages?.[0]?.counts

                    return (
                        { ...counts } || { all: undefined, unseen: undefined }
                    )
                })

                console.log({ response })
            } catch (err) {
                console.log(err)
            }
        }
        getInitialData()
    }, [queryClient])

    useQuery({
        queryKey: ['single-notifications-state'],
        initialData: {},
        queryFn: () => ({}),
    })

    // useEffect(() => {
    //     queryClient.setQueryData(['counts'], (currentData) => {
    //         console.log(data)

    //         console.log('test', data)

    //         const counts = data?.pages?.[0]?.counts

    //         return { ...counts } || { all: undefined, unseen: undefined }
    //     })
    // }, [data, queryClient])

    // console.log(data)
    // console.log({ hasPreviousPage }, { hasNextPage })

    return (
        <>
            <Header />
            <div className="pt-5">
                <Form />
                {/* <button
                    disabled={!hasNextPage}
                    onClick={() => fetchNextPage()}
                >
                    add
                </button> */}
            </div>
        </>
    )
}

export default Home
