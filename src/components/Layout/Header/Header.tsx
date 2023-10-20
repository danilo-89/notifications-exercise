import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'

// Contexts
import { useNotificationsUpdateContext } from '@/hooks/useNotificationsUpdateContext'

// Components
import NotificationsWrapper from '@/components/NotificationsWrapper'
import BellIcon from '@/components/icons/BellIcon'
import LoaderDots from '@/components/loaders/LoaderDots'

const Header = () => {
    const queryClient = useQueryClient()
    const [showNotifications, setShowNotifications] = useState(false)
    const { setNewNotifications, newNotifications } =
        useNotificationsUpdateContext()

    const { data } = useQuery({
        queryKey: ['counts'],
        initialData: { all: undefined, unseen: undefined },
        staleTime: Infinity,
    })

    const allNotificationsState = queryClient.getQueryState([
        'notifications',
        'all',
    ])

    const totalCount = data?.all

    return (
        <>
            <header className="fixed z-10 flex h-[4.5rem] w-full items-center justify-between bg-whiteSmoke px-7">
                <div className="flex h-10 w-[6.25rem] items-center justify-center rounded-[0.625rem] border-2 border-slateGray bg-white text-slateGray">
                    {totalCount === undefined ? <LoaderDots /> : totalCount}
                </div>

                <button
                    className="relative flex h-12 w-12 items-center justify-center"
                    onClick={() => {
                        if (!showNotifications) {
                            setNewNotifications(0)
                            // Remove queries, on list open, for both 'all' and 'unseen' notifications
                            // if data was invalidated previously
                            if (allNotificationsState?.isInvalidated) {
                                queryClient.removeQueries({
                                    queryKey: ['notifications'],
                                    exact: false,
                                })
                            }
                        }

                        setShowNotifications((curr) => !curr)
                    }}
                >
                    <BellIcon />
                    <UnreadIndicator newNotifications={newNotifications} />
                </button>
            </header>
            {showNotifications ? <NotificationsWrapper /> : null}
        </>
    )
}

const UnreadIndicator = ({
    newNotifications,
}: {
    newNotifications: number
}) => {
    if (typeof newNotifications === 'number' && newNotifications > 0) {
        return (
            <span
                className={clsx(
                    'absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full',
                    newNotifications === 0
                        ? 'bg-[#d9d9d9] text-slateGray text-sm'
                        : 'bg-azure text-white text-xs'
                )}
            >
                {newNotifications === 0 ? '' : newNotifications}
            </span>
        )
    }

    return null
}

export default Header
