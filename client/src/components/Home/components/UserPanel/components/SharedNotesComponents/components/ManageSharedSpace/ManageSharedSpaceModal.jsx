import './ManageSharedSpaceModal.scss'
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import PersonIcon from '@mui/icons-material/Person';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../../../../../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

import { SocketContext } from '../../../../../../../../contexts/UserSocketContext'


function ManageSharedSpaceModal({ setManageModal, sharedBook, sharedNotes }) {
    const socket = useContext(SocketContext);
    const [userContext, setUserContext] = useContext(UserContext);
    const [addUser, setAddUser] = useState(false)
    const [deleteNotebook, setDeleteNotebook] = useState(false)
    const [searchResult, setSearchResult] = useState(null)
    const [fetching, setFetching] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)
    const navigate = useNavigate()

    const handleCloseIconClick = async () => {
        // const sharedNotesContainer = document.getElementById('SharedNotes-content')
        // sharedNotesContainer.classList.remove('display-none')
        setManageModal(false)
    }
    const [displayMessage, setDisplayMessage] = useState("");
    const [query, setQuery] = useState("");

    const searchNotes = async (searchValue) => {
        const res = await axios.post('/shared_notes/search_user', { searchValue: searchValue }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        setSearchResult(res.data)
        setFetching(false)
    }

    const handleClickOnUserToAdd = (uuid) => {
        setSelectedUserId(uuid)
    }

    const addUserToSharedNotebook = async () => {
        const res = await axios.post('/shared_notes/add-to-book', { friend_uuid: selectedUserId, shared_book_uuid: sharedBook.uuid }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        if (res.status === 200) {
            const btn = document.getElementById('add-selected-user-btn')
            btn.innerText = 'Success!'
            setTimeout(() => {
                setSelectedUserId(null)
            }, 500);

            // send notification to added user
            const res2 = await axios.post('/user/notification-add-to-shared-notebook', { added_user_uuid: selectedUserId, shared_book_uuid: sharedBook.uuid, shared_book_title: sharedBook.title, admin_uuid: sharedBook.admin_uuid }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            if (res2.status === 200) {
                const notificationData = res2.data
                socket.emit('sendNotification', notificationData)
            }
        }
    }

    const handleDeleteNotebook = async () => {
        const res = await axios.post('/shared_notes/delete-book', { sharedBook: sharedBook }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        if (res.status === 200) {
            const res2 = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            sharedNotes.setUserSharedNotes(res2.data[1])
            navigate('/')
        }
    }

    useEffect(() => {
        const timeOutId = setTimeout(() => setDisplayMessage(query), 500);
        return () => clearTimeout(timeOutId);
    }, [query]);

    useEffect(() => {
        if (displayMessage.length > 0) {
            searchNotes(displayMessage)
        }


    }, [displayMessage]);


    return (
        <div className='ManageSharedSpaceModal'>
            <CloseIcon className='ManageSharedSpaceModal-close-icon' id='close-icon' onClick={() => handleCloseIconClick()} />

            <div className='ManageSharedSpaceModal-container'>
                <h2>{sharedBook.title}</h2>
                <div className='ManageSharedSpaceModal-container-btns'>
                    <div className='ManageSharedSpaceModal-btns-add-user' onClick={() => { setAddUser(!addUser); setDeleteNotebook(false) }} style={addUser ? { opacity: 1 } : undefined}>add user</div>
                    <div className='ManageSharedSpaceModal-btns-delete-notebook' onClick={() => { setDeleteNotebook(!deleteNotebook); setAddUser(false) }} style={deleteNotebook ? { opacity: 1 } : undefined}>delete notebook</div>
                </div>
                <div className='ManageSharedSpaceModal-container-content'>
                    {addUser && <div className='ManageSharedSpaceModal-content-add-user'>
                        <h4>Add user</h4>
                        <input type="text" placeholder='Search by username' required onChange={e => { setQuery(e.target.value); e.target.value.length > 0 ? setFetching(true) : setFetching(false); setSearchResult(null) }} value={query} />
                        {!fetching || searchResult ?
                            <div className='ManageSharedSpaceModal-content-result'>
                                {searchResult && <div>
                                    {searchResult.map(user => {
                                        return <div key={user.uuid} className={user.uuid === userContext.data.id ? 'display-none' : undefined}>
                                            <div className={selectedUserId === user.uuid ? 'ManageSharedSpaceModal-content-result-user selected-user' : 'ManageSharedSpaceModal-content-result-user'} onClick={() => handleClickOnUserToAdd(user.uuid)}>
                                                <PersonIcon fontSize='small' className={selectedUserId === user.uuid ? 'selected-user-icon' : undefined} />
                                                <span>{user.username}</span>
                                            </div>
                                        </div>
                                    })}
                                </div>}
                            </div>
                            :
                            <CircularProgress size={'25px'} color='inherit' />
                        }


                    </div>}
                    {selectedUserId && !deleteNotebook && <div id='add-selected-user-btn' className='ManageSharedSpaceModal-content-add-user-btn' onClick={() => { addUserToSharedNotebook() }}>
                        Add user
                    </div>}

                    {deleteNotebook && <div className='ManageSharedSpaceModal-content-delete-notebook'>
                        <h4>Please confirm</h4>
                        <div onClick={() => handleDeleteNotebook()} >Delete</div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ManageSharedSpaceModal