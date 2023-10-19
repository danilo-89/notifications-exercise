import { Fragment } from 'react'
import { InfiniteData } from '@tanstack/react-query'

// Components
import NotificationItem from '../NotificationItem'

interface IProps {
    data:
        | InfiniteData<
              {
                  data: unknown
                  counts: {
                      all: string | undefined
                      unseen: string | undefined
                  }
              },
              unknown
          >
        | undefined
}

const NotificationsList = ({ data }: IProps) => {
    if (
        Array.isArray(data?.pages?.[0]?.data) &&
        data?.pages?.[0]?.data?.length
    ) {
        return (
            <ul className="relative z-[1]">
                {data?.pages?.map((group, idx: number) => (
                    <Fragment key={idx}>
                        {Array.isArray(group?.data) &&
                            group?.data?.map((item) => (
                                <NotificationItem
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                    </Fragment>
                ))}
            </ul>
        )
    }

    return (
        <div className="text-center p-5 pt-12 text-slateGray text-sm">
            No notifications to show!
        </div>
    )
}

export default NotificationsList
