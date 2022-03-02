import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import './UserSettings.scss'


function UserSettings() {

    const handleMouseEnterAdd = () => {
        const addSpan = document.getElementById('logout-span')
        addSpan.classList.remove('display-none')
        addSpan.classList.add('display-block')
        setTimeout(() => {
            addSpan.setAttribute('style', 'opacity: 1')
        }, 20);
    }

    const handleMouseLeaveAdd = () => {
        const addSpan = document.getElementById('logout-span')
        addSpan.setAttribute('style', 'opacity: 0')
        setTimeout(() => {
            addSpan.classList.remove('display-block')
            addSpan.classList.add('display-none')
        }, 50);
    }

    const handleLogout = async () => {
        await axios.post('/user/logout', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        window.location.reload(false);
    }



    return (
        <div className="UserSettings">
            <LogoutIcon id='logout-icon' onMouseEnter={() => handleMouseEnterAdd()} onMouseLeave={() => handleMouseLeaveAdd()} onClick={handleLogout} />
            <span id='logout-span' className='display-none'>Log out</span>

        </div>
    )
}

export default UserSettings