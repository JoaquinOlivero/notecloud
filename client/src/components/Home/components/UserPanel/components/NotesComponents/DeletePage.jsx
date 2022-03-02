import './DeletePage.scss'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useParams } from 'react-router-dom';
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_BACKEND_API;

function DeletePage({ setUserNotes, uuid, setBtnSpan, isSharedNotes, sharedNotes, sharedBookUuid }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const handleDelete = async () => {
        if (!isSharedNotes) {
            const res = await axios.post('/notes/delete', { uuid: uuid }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            if (res.status === 200) {

                const res2 = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                setUserNotes(res2.data[0])
                const checkIfNoteExists = await axios.post('/notes/single', { url: id }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                console.log();
                if (checkIfNoteExists.data.msg === 404) {
                    if (res.data.title && res.data.uuid) {
                        navigate(`/${res.data.title}-${res.data.uuid}`)
                    } else {
                        navigate('/')
                    }
                }


            }
        } else {
            const res = await axios.post('/shared_notes/delete-shared-page', { shared_page_uuid: uuid }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })

            if (res.status === 200) {
                const res2 = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                sharedNotes.setUserSharedNotes(res2.data[1])
                const socket = socketIOClient(ENDPOINT);
                const data = { uuid: sharedBookUuid, sharedNotes: res2.data[1] }
                socket.emit('updateSharedNotesState', data)

                if (res.data.uuid) {
                    const parentUuid = res.data.uuid
                    navigate(`/shared-${sharedBookUuid}/${parentUuid}`)
                } else {
                    const indexOfSharedBookInRes2 = res2.data[1].findIndex(arr => { return arr.uuid === sharedBookUuid })
                    if (res2.data[1][indexOfSharedBookInRes2].pages.length > 0) {
                        const nextSharedPageInSharedBookUuid = res2.data[1][indexOfSharedBookInRes2].pages[0].uuid
                        navigate(`/shared-${sharedBookUuid}/${nextSharedPageInSharedBookUuid}`)
                    } else {
                        navigate('/')
                    }

                }
            }
        }
    }

    const handleMouseEnterTrash = () => {
        const deleteSpan = document.getElementById(`btn-span-${uuid}`)
        deleteSpan.setAttribute('style', 'opacity: 1')
        setBtnSpan('Delete')
    }

    const handleMouseLeaveTrash = () => {
        const deleteSpan = document.getElementById(`btn-span-${uuid}`)
        deleteSpan.setAttribute('style', 'opacity: 0')
    }

    return <div className='DeletePage' onMouseEnter={() => handleMouseEnterTrash()} onMouseLeave={() => handleMouseLeaveTrash()} onClick={handleDelete}>
        <DeleteIcon fontSize='small' />
    </div>;
}

export default DeletePage;
