import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

// Requests
import { getNotifications } from '@/requests'

// Contexts
import { useNotificationsUpdateContext } from '@/hooks/useNotificationsUpdateContext'

// Components
import Form from '@/components/Form'
import Header from '@/components/Layout/Header'

const Home = () => {
    const { setNewNotifications } = useNotificationsUpdateContext()
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

                const counts = response?.pages?.[0]?.counts

                queryClient.setQueryData(['counts'], () => {
                    return counts || { all: undefined, unseen: undefined }
                })

                setNewNotifications(Number(counts?.unseen) || 0)
            } catch (err) {
                console.log(err)
            }
        }
        getInitialData()
    }, [queryClient, setNewNotifications])

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
