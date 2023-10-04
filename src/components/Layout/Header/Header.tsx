import NotificationsList from '@/components/NotificationsList'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const Header = () => {
    const [showNotifications, setShowNotifications] = useState(false)

    const {
        data,
        dataUpdatedAt,
        error,
        errorUpdateCount,
        errorUpdatedAt,
        failureCount,
        failureReason,
        fetchStatus,
        isError,
        isFetched,
        isFetchedAfterMount,
        isFetching,
        isInitialLoading,
        isLoading,
        isLoadingError,
        isPaused,
        isPlaceholderData,
        isPreviousData,
        isRefetchError,
        isRefetching,
        isStale,
        isSuccess,
        refetch,
        remove,
        status,
    } = useQuery({
        queryKey: ['counts'],
        initialData: { all: undefined, unseen: undefined },
        staleTime: Infinity,
    })

    console.log(data)

    return (
        <>
            <header className="fixed flex justify-between w-full z-10 h-[4.5rem] bg-slate-100 items-center px-7">
                <div className="w-[6.25rem] h-10 flex items-center justify-center border-2 rounded-[0.625rem]">
                    {data.all}
                </div>
                <button onClick={() => setShowNotifications((curr) => !curr)}>
                    bell icon, {data.unseen}
                </button>
            </header>
            {showNotifications ? <NotificationsList /> : null}
        </>
    )
}

export default Header
