import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Requests
import { getNotifications } from '@/requests'

// Components
import Form from '@/components/Form'
import Header from '@/components/Layout/Header'

const Home = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        // get first page for notifications on load
        const getInitialData = async () => {
            try {
                const response = await queryClient.fetchInfiniteQuery({
                    queryKey: ['notifications', 'all'],
                    initialPageParam: 1,
                    queryFn: async (pageParam) =>
                        await getNotifications(pageParam.pageParam),
                })

                console.log(response)

                queryClient.setQueryData(['counts'], () => {
                    console.log(response)

                    console.log('test', response)

                    const counts = response?.pages?.[0]?.counts

                    return counts || { all: undefined, unseen: undefined }
                })
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

    return (
        <>
            <Header />
            <div className="pt-5">
                <Form />
            </div>
        </>
    )
}

export default Home
