import { z } from 'zod'

export const formSchema = z.object({
    user: z.string().optional(),
    body: z.string().nonempty(),
})
