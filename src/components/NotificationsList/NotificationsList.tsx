import { Fragment } from 'react'
import NotificationItem from '../NotificationItem'

const NotificationsList = ({ data }) => {
    if (!data?.pages?.[0]?.data?.length) {
        return (
            <div className="text-center p-5 pt-12 text-slateGray text-sm">
                No notifications to show!
            </div>
        )
    }

    return (
        <ul>
            {data?.pages?.map((group, i) => (
                <Fragment key={i}>
                    {group?.data?.map((item) => (
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

export default NotificationsList
