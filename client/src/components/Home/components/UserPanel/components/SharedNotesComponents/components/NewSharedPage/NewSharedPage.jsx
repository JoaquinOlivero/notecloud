import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import './NewSharedPage.scss'
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_BACKEND_API;

function NewSharedPage({ sharedBookUuid, setBtnSpanManage, sharedNotes }) {

    const handleNewSharedPage = async () => {
        const res = await axios.post('/shared_notes/new-shared-page', { shared_book_uuid: sharedBookUuid }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        if (res.status === 200) {

            const res = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            sharedNotes.setUserSharedNotes(res.data[1])
            const socket = socketIOClient(ENDPOINT);
            const data = { uuid: sharedBookUuid, sharedNotes: res.data[1] }
            socket.emit('updateSharedNotesState', data)
        }
    }

    const handleMouseEnterAdd = () => {
        const addSpan = document.getElementById(`btn-span-${sharedBookUuid}`)
        addSpan.setAttribute('style', 'opacity: 1')
        setBtnSpanManage('Add page')
    }

    const handleMouseLeaveAdd = () => {
        const addSpan = document.getElementById(`btn-span-${sharedBookUuid}`)
        addSpan.setAttribute('style', 'opacity: 0')
    }

    return (
        <div className='NewSharedPage'>
            <button onMouseEnter={() => handleMouseEnterAdd()} onMouseLeave={() => handleMouseLeaveAdd()} onClick={handleNewSharedPage}><AddIcon fontSize='small' /></button>
        </div>
    )
}

export default NewSharedPage