import { z } from 'zod'

// Schemas
import { formSchema } from '@/schemas'

export type FormSchema = z.infer<typeof formSchema>
