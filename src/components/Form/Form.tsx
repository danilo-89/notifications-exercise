import { postNotification } from '@/requests'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormEventHandler, useState } from 'react'
import { toast } from 'sonner'
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

    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        try {
            e.preventDefault()

            const dataObject = {
                user,
                body,
            }

            formSchema.parse(dataObject)
            mutate(dataObject)
        } catch (err) {
            console.log(err)
            console.log(err?.errors)
            toast(
                <div>
                    <div>test</div>
                    <div>{err?.errors?.[0]?.message}</div>
                </div>
            )
        }
    }

    return (
        <form
            className="relative top-[50vh] z-[1] mx-auto flex w-[30rem] -translate-y-1/2 flex-col rounded-3xl bg-whiteSmoke px-14 pb-10 pt-20"
            onSubmit={(e) => handleSubmit(e)}
        >
            <label
                htmlFor="user"
                className="mb-2 text-slateGray"
            >
                User name
            </label>
            <input
                id="user"
                name="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                type="text"
                className="mb-6"
            />

            <label
                htmlFor="body"
                className="mb-2 text-slateGray"
            >
                Message *
            </label>
            <textarea
                className="mb-[4.375rem]"
                id="body"
                name="body"
                rows={4}
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
            <div className="text-center">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-azure hover:bg-slateGray transition-colors text-white py-3 px-6 rounded-[1.875rem] disabled:bg-azure/10"
                >
                    Send Notification
                </button>
            </div>
        </form>
    )
}

export default Form
