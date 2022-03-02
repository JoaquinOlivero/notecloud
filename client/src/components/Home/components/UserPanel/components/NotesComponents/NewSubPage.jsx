import React from 'react';
import './NewSubPage.scss'
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import socketIOClient from "socket.io-client";
const ENDPOINT = process.env.REACT_APP_BACKEND_API;

function NewSubPage({ setUserNotes, setBtnSpan, uuid, isSharedNotes, sharedBookUuid, sharedNotes }) {
    const handleNewPage = async () => {
        if (!isSharedNotes) {
            const res = await axios.post('/notes/new', { uuid: uuid }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            if (res.status === 200) {
                const res = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                setUserNotes(res.data[0])
            }
        } else {
            const res = await axios.post('/shared_notes/new-shared-page', { child_of: uuid, shared_book_uuid: sharedBookUuid }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            if (res.status === 200) {
                const res = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                sharedNotes.setUserSharedNotes(res.data[1])
                const socket = socketIOClient(ENDPOINT);
                const data = { uuid: sharedBookUuid, sharedNotes: res.data[1] }
                socket.emit('updateSharedNotesState', data)
            }
        }
    }

    const handleMouseEnterAdd = () => {
        const addSpan = document.getElementById(`btn-span-${uuid}`)
        addSpan.setAttribute('style', 'opacity: 1')
        setBtnSpan('Add page')
    }

    const handleMouseLeaveAdd = () => {
        const addSpan = document.getElementById(`btn-span-${uuid}`)
        addSpan.setAttribute('style', 'opacity: 0')
    }

    return <div className='NewSubPage'>
        {/* <span id="add-sub-page">Add Page</span> */}
        <button onMouseEnter={() => handleMouseEnterAdd()} onMouseLeave={() => handleMouseLeaveAdd()} onClick={handleNewPage}><AddIcon fontSize='small' /></button>
    </div>;
}

export default NewSubPage;
