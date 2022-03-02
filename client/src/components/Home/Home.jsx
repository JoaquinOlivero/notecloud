import './Home.scss'
import UserPanel from './components/UserPanel/UserPanel'
import NotesContent from './components/NotesContent/NotesContent'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';


function Home({ userNotes, setUserNotes, sharedNotes }) {


    const handleChevronClick = () => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)

        const userPanel = document.getElementById('UserPanel')
        const notesContent = document.getElementById('NotesContent')
        const homeChevron = document.getElementById('Home-chevron')
        const notes = document.getElementById("UserPanel-notes");
        const sharedNotes = document.getElementById("UserPanel-SharedNotes");
        const navbarContainer = document.getElementById("Navbar");

        if (vw > 1300) {
            userPanel.setAttribute('style', 'width: 18%')
            notesContent.setAttribute('style', 'margin-left: 18%')
        } else if (vw <= 1300) {
            userPanel.setAttribute('style', 'width: 25%')
            notesContent.setAttribute('style', 'margin-left: 25%')
        }
        homeChevron.setAttribute('style', 'opacity: 0')
        notes.setAttribute('style', 'opacity: 1')
        sharedNotes.setAttribute('style', 'opacity: 1')
        setTimeout(() => {
            navbarContainer.removeAttribute('style')
        }, 450);
    }





    return (
        <div className='Home'>
            <DoubleArrowIcon className='Home-chevron' id='Home-chevron' fontSize='small' onClick={handleChevronClick} />
            <UserPanel userNotes={userNotes} setUserNotes={setUserNotes} sharedNotes={sharedNotes} />
            <NotesContent userNotes={userNotes} sharedNotes={sharedNotes} />
        </div>
    )
}

export default Home
