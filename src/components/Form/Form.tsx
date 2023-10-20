import { FormEventHandler, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ZodError } from 'zod'

// Schemas
import { formSchema } from '@/schemas'

// Contexts
import { useNotificationsUpdateContext } from '@/hooks/useNotificationsUpdateContext'

// Requests
import { postNotification } from '@/requests'

const Form = () => {
    const { setNewNotifications } = useNotificationsUpdateContext()
    const queryClient = useQueryClient()
    const [user, setUser] = useState('')
    const [body, setBody] = useState('')

    const { mutate, isPending } = useMutation({
        mutationKey: ['post-notification'],
        mutationFn: postNotification,
        onSuccess() {
            // invalidate query for active notifications query
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                exact: false,
                type: 'active',
                refetchType: 'none',
            })
            // clear data cache for inactive notifications query
            queryClient.removeQueries({
                queryKey: ['notifications'],
                exact: false,
                type: 'inactive',
            })

            setNewNotifications((curr) => curr + 1)
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
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                toast(
                    <div>
                        <div className="font-bold text-base">Error</div>
                        <div>{err?.errors?.[0]?.message}</div>
                    </div>
                )
            }
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
                onChange={(e) => setBody(e.target.value)}
                value={body}
            />
            <div className="text-center">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-azure hover:bg-slateGray transition-colors text-white py-3 px-6 rounded-[1.875rem] disabled:bg-azure/10"
                >
                    Send Notification
                </button>
            </div>
        </form>
    )
}

export default Form
