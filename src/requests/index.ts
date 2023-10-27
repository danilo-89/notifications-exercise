import { AxiosHeaders } from 'axios'

// Services
import { baseApi } from '@/services/baseApi'

// Utilities
import { parseLinkHeader } from '@/utils/parseLinkHeader'

// Types
import { FormSchema } from '@/types/schemas'

export const getNotifications = async (pageNumber: number, unseen = false) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await baseApi.get(
            `notifications?${unseen ? 'seen=false&' : ''}_page=${
                pageNumber || 1
            }&_limit=${10}&_sort=createdAt&_order=desc`
        )

        const linkHeader = (response?.headers as AxiosHeaders)
            ?.get?.('link')
            ?.toString()

        const counts = {
            all: (response?.headers as AxiosHeaders)
                ?.get?.('x-total')
                ?.toString(),
            unseen: (response?.headers as AxiosHeaders)
                ?.get?.('x-unseen')
                ?.toString(),
        }

        const linkHeaderParsed = parseLinkHeader(linkHeader || '')

        return {
            data: response?.data,
            meta: { ...linkHeaderParsed },
            counts,
        }
    } catch (error: unknown) {
        throw error
    }
}

export const postNotification = async (submittedData: FormSchema) => {
    try {
        const response = await baseApi.post(
            'http://localhost:3001/notifications',
            submittedData
        )

        const counts = {
            all: (response?.headers as AxiosHeaders)
                ?.get?.('x-total')
                ?.toString(),
            unseen: (response?.headers as AxiosHeaders)
                ?.get?.('x-unseen')
                ?.toString(),
        }

        return { data: [{ ...response.data }], counts }
    } catch (error: unknown) {
        /* empty */
    }
}

export const readAllNotifications = async () => {
    try {
        const response = await baseApi.put(
            'http://localhost:3001/notifications'
        )

        const counts = {
            all: (response?.headers as AxiosHeaders)
                ?.get?.('x-total')
                ?.toString(),
            unseen: (response?.headers as AxiosHeaders)
                ?.get?.('x-unseen')
                ?.toString(),
        }

        return {
            data: response?.data,
            counts,
        }
    } catch (error) {
        console.log(error)
    }
}

export const readSingleNotification = async (id: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await baseApi.patch(
            `http://localhost:3001/notifications/${id}`
        )

        const counts = {
            all: (response?.headers as AxiosHeaders)
                ?.get?.('x-total')
                ?.toString(),
            unseen: (response?.headers as AxiosHeaders)
                ?.get?.('x-unseen')
                ?.toString(),
        }

        return {
            data: response?.data,
            counts,
        }
    } catch (error: unknown) {
        throw error
        console.log(error)
    }
}
