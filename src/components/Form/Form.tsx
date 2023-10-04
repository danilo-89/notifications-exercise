import { postNotification } from '@/requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'

const formSchema = z.object({
    user: z.string().optional(),
    body: z.string().nonempty(),
})

const Form = () => {
    const queryClient = useQueryClient()
    const [user, setUser] = useState('')
    const [body, setBody] = useState('')

    const {
        data,
        error,
        isError,
        isIdle,
        isLoading,
        isPaused,
        isSuccess,
        failureCount,
        failureReason,
        mutate,
        mutateAsync,
        reset,
        status,
    } = useMutation({
        mutationKey: ['post-notification'],
        mutationFn: postNotification,
        onSuccess(responseData, variables, context) {
            console.log(responseData.data)
            queryClient.setQueriesData(
                { queryKey: ['notifications'] },
                (data) => {
                    console.log(data)
                    return {
                        ...data,
                        pages: [{ ...responseData }, ...data.pages],
                    }
                }
            )
        },
    })

    return (
        <form
            className="flex flex-col w-[30rem] bg-slate-300 px-14 pt-20 pb-10 rounded-3xl mx-auto top-[50vh] relative -translate-y-1/2 z-[1]"
            onSubmit={(e) => {
                e.preventDefault()
                mutate()
            }}
        >
            <input
                className="border"
                id="user"
                name="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                type="text"
            />
            <textarea
                className="border"
                id="body"
                name="body"
                cols="30"
                rows="10"
                // defaultValue=""
                onChange={(e) => setBody(e.target.value)}
                value={body}
            />

            <button
                onClick={() => {
                    // queryClient.invalidateQueries({
                    //     queryKey: ['notifications'],
                    //     refetchType: 'none',
                    // })
                    // queryClient.resetQueries({ queryKey: ['notifications'] })
                    queryClient.removeQueries({ queryKey: ['notifications'] })
                }}
            >
                invalidate
            </button>
            <button
                type="submit"
                disabled={isLoading}
            >
                Submit
            </button>
        </form>
    )
}

export default Form
