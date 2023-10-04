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

    const {
        isPending,
        error,
        data,
        fetchNextPage,
        hasNextPage,
        hasPreviousPage,
    } = useNotificationsQuery()

    useEffect(() => {
        queryClient.setQueryData(['counts'], (currentData) => {
            console.log(data)

            console.log('test', data)

            const counts = data?.pages?.[0]?.counts

            return counts || { all: undefined, unseen: undefined }
        })
    }, [data, queryClient])

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
