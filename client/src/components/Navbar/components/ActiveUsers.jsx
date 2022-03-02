import './ActiveUsers.scss'
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../../contexts/UserSocketContext'

function ActiveUsers() {
    const [activeUsersArr, setActiveUsersArr] = useState(null)
    const socket = useContext(SocketContext);
    const randomNumber = () => { return Math.floor(Math.random() * (8 - 0 + 1) + 0) }

    const handleMouseEnterUsername = (id) => {
        const addSpan = document.getElementById(`username-${id}`)
        addSpan.classList.remove('display-none')
        addSpan.classList.add('display-block')
        setTimeout(() => {
            addSpan.setAttribute('style', 'opacity: 1')
        }, 20);
    }

    const handleMouseLeaveUsername = (id) => {
        const addSpan = document.getElementById(`username-${id}`)
        addSpan.setAttribute('style', 'opacity: 0')
        setTimeout(() => {
            addSpan.classList.remove('display-block')
            addSpan.classList.add('display-none')
        }, 10);
    }

    useEffect(() => {
        socket.on('activeUsers', data => {
            setActiveUsersArr(data)
        })

        return () => setActiveUsersArr(null)
    }, [])

    return (
        <div className="ActiveUsers">
            {activeUsersArr && activeUsersArr.map(user => {
                return <div className='ActiveUsers-user' key={user.notecloudId}>
                    <img src={`https://randomuser.me/api/portraits/lego/${randomNumber()}.jpg`} alt={user.username}
                        onMouseEnter={() => handleMouseEnterUsername(user.userID)}
                        onMouseLeave={() => handleMouseLeaveUsername(user.userID)}
                    />
                    <span id={`username-${user.userID}`}>{user.username}</span>
                    <div className='user-green-dot'></div>
                </div>
            })}
        </div>
    )
}

export default ActiveUsers