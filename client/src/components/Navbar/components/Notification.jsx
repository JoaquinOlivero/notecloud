import NotificationsIcon from '@mui/icons-material/Notifications';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import './Notification.scss'
import OutsideClickHandler from 'react-outside-click-handler';


// Socket.io
import { SocketContext } from '../../../contexts/UserSocketContext'

function Notification({ sharedNotes }) {
    const socket = useContext(SocketContext);
    const [notifications, setNotifications] = useState([])
    const [notificationsLength, setNotificationsLength] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)


    const handleClickNotificationIcon = async () => {

        if (notifications) {
            if (!modalOpen) {
                await setModalOpen(!modalOpen)
                const modal = document.getElementById('Notification-modal')
                setTimeout(() => {
                    modal.setAttribute('style', 'opacity: 1')
                }, 20);
                setNotificationsLength(null)
            } else {
                const modal = document.getElementById('Notification-modal')
                modal.setAttribute('style', 'opacity: 0')

                setTimeout(() => {

                    setModalOpen(!modalOpen)
                }, 200);

                await axios.post('/user/delete-notification', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                setNotifications([])
            }
        } else {
            if (!modalOpen) {
                await setModalOpen(!modalOpen)
                const modal = document.getElementById('Notification-modal')
                setTimeout(() => {
                    modal.setAttribute('style', 'opacity: 1')
                }, 20);
            } else {
                const modal = document.getElementById('Notification-modal')
                modal.setAttribute('style', 'opacity: 0')

                setTimeout(() => {
                    setModalOpen(!modalOpen)
                }, 200);

            }
        }
    }

    useEffect(() => {
        const getNotification = async () => {
            const res = await axios.get('/user/notification', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            if (res.data.length > 0) {
                const receivedNotifications = res.data
                const notificationsArr = []
                for (const notification of receivedNotifications) {
                    let clean = DOMPurify.sanitize(notification.text)
                    delete notification.text;
                    notification.html = clean
                    notificationsArr.push(notification)
                }
                setNotifications(notificationsArr)
            }
        }
        getNotification()

        socket.on('updateNotificationState', notificationData => {
            const updateSharedNotes = async () => {
                const res2 = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                sharedNotes.setUserSharedNotes(res2.data[1])
            }
            let clean = DOMPurify.sanitize(notificationData.text)
            delete notificationData.text;
            notificationData.html = clean
            setNotifications(notifications => [...notifications, notificationData])
            updateSharedNotes()
        })

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (notifications.length > 0) {
            setNotificationsLength(notifications.length)
        }
    }, [notifications])


    return (
        <OutsideClickHandler
            onOutsideClick={() => {
                if (modalOpen) {
                    handleClickNotificationIcon()
                }
            }}
        >
            <div className='Notification'>
                <NotificationsIcon id='notification-icon' onClick={handleClickNotificationIcon} />
                {notifications.length > 0 && modalOpen ? <div className='Notification-modal' id='Notification-modal'>
                    {notifications.map(notification => {
                        return <div key={notification.uuid} className='Notification-single'>
                            <div dangerouslySetInnerHTML={{ __html: notification.html }} className='Notification-single-content'></div>
                        </div>
                    })}

                </div>
                    :
                    <div className='Notification-modal modal-empty' id='Notification-modal'><span>Nothing to see here...</span></div>
                }
                {notifications.length > 0 && notificationsLength && <div id='Notification-amount'>{notificationsLength}</div>}
            </div>
        </OutsideClickHandler>
    )
}

export default Notification