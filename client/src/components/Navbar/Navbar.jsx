import './Navbar.scss'
import ExportPdf from './components/ExportPdf'
import Notification from './components/Notification'
import { useParams } from 'react-router-dom'
import ActiveUsers from './components/ActiveUsers'
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react'

function Navbar({ userNotes, sharedNotes }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const { notebookUuid } = useParams()

    const handleMenuClick = async () => {
        if (menuOpen === false) {
            setMenuOpen(true)
            const userPanel = document.getElementById('UserPanel')
            userPanel.classList.remove('display-none')
            userPanel.classList.add('display-block')
            userPanel.setAttribute('style', 'opacity: 1')

        } else {
            const userPanel = document.getElementById('UserPanel')
            userPanel.setAttribute('style', 'display: none')

            setMenuOpen(false)
        }

    }


    return (
        <div className="Navbar" id='Navbar'>
            <div className="Navbar-container" >
                <div className='Navbar-controls'>
                    <ExportPdf userNotes={userNotes} />
                </div>

                <div className='Navbar-notification'>
                    <Notification sharedNotes={sharedNotes} />
                    <MenuIcon className='Navbar-menu' id='Navbar-menu' onClick={handleMenuClick} />
                </div>
            </div>

            {notebookUuid && <div className='Navbar-active-users-container'>
                <ActiveUsers />
            </div>}
        </div>
    )
}

export default Navbar
