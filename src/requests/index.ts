import { baseApi } from '@/services/baseApi'
import { parseLinkHeader } from '@/utils/parseLinkHeader'
import { AxiosHeaders } from 'axios'

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

        console.log(
            'check counts',
            (response?.headers as AxiosHeaders)?.get?.('x-total')
        )

        const linkHeaderParsed = parseLinkHeader(linkHeader || '')

        // console.log({ linkHeaderParsed })

        return {
            data: response?.data,
            meta: { ...linkHeaderParsed },
            counts,
        }
    } catch (error: unknown) {
        throw error
        console.log(error.message)
    }
}

export const postNotification = async (submittedData) => {
    try {
        const response = await baseApi.post(
            'http://localhost:3001/notifications',
            submittedData
            // {
            //     user: 'test',
            //     body: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vel eum enim, ex natus non fugit.',
            // }
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
    } catch (error) {
        console.log(error.message)
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
    } catch (error) {
        console.log(error)
    }
}
