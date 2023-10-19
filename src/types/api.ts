export interface Notification {
    id: string
    seen: boolean
    body: string
    createdAt: number
    user?: string // Optional user field
}

export interface Notifications {
    notifications: Notification[]
}
