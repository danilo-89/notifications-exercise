import { readSingleNotification } from '@/requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const NotificationItem = ({ item }) => {
    const queryClient = useQueryClient()
    const [hideDot, setHideDot] = useState(false)

    const { mutate } = useMutation({
        mutationKey: ['read-single-notification', item.id],
        mutationFn: () => readSingleNotification(item.id),
        onSuccess(responseData, variables, context) {
            setHideDot(true)
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                refetchType: 'none',
            })

            queryClient.setQueryData(['counts'], (currentData) => {
                const counts = responseData?.counts

                return counts || { all: undefined, unseen: undefined }
            })

            console.log(responseData)
            // queryClient.resetQueries({ queryKey: ['notifications'] })
            // setShowUnread(false)
            // // queryClient.removeQueries({ queryKey: ['notifications'] })
        },
    })

    return (
        <li className="flex py-4 pl-6 pr-4 border text-xs z-10 relative">
            {item.user ? (
                <div className="w-10 h-10 rounded-full bg-orange-300 flex-shrink-0 mr-2"></div>
            ) : null}
            <div>
                <div>{item.body}</div>
                <div>{item.createdAt}</div>
            </div>
            <div className="ml-auto">
                {!item.seen && !hideDot ? (
                    <button
                        onClick={() => mutate()}
                        className="inline-block h-3.5 w-3.5 bg-blue-600 rounded-full ml-2"
                    />
                ) : null}
            </div>
        </li>
    )
}

export default NotificationItem
