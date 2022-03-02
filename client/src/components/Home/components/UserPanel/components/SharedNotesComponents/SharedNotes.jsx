import NewSharedSpace from './components/NewSharedSpace/NewSharedSpace'
import Notes from '../Notes'
import ManageSharedSpace from './components/ManageSharedSpace/ManageSharedSpace'
import './SharedNotes.scss'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { UserContext } from '../../../../../../contexts/UserContext'
import NewSharedPage from './components/NewSharedPage/NewSharedPage'
import ManageSharedSpaceModal from './components/ManageSharedSpace/ManageSharedSpaceModal'

// Socket.io
// import socketIOClient from "socket.io-client";
// const ENDPOINT = process.env.REACT_APP_BACKEND_API;
import { SocketContext } from '../../../../../../contexts/UserSocketContext'


function SharedNotes({ sharedNotes }) {
    const socket = useContext(SocketContext);
    const [userContext, setUserContext] = useContext(UserContext);
    const { notebookUuid } = useParams()
    const [isSharedNotes, setIsSharedNotes] = useState(true)
    const [btnSpanManage, setBtnSpanManage] = useState(null);
    const [manageModal, setManageModal] = useState(false)
    const [sharedBook, setsharedBook] = useState(null)
    const userSharedNotes = sharedNotes.userSharedNotes
    // const setUserSharedNotes = (data) => {
    //     sharedNotes.setUserSharedNotes(data)
    // }

    const handleNotebookClick = async (uuid) => {
        const notebookTitleDiv = document.getElementById(`SharedNotes-notebook-content-${uuid}`)
        if (notebookTitleDiv.classList.contains('display-none')) {
            notebookTitleDiv.classList.remove('display-none')
            notebookTitleDiv.classList.add('display-block')
            setTimeout(() => {
                notebookTitleDiv.setAttribute('style', 'opacity: 1')
            }, 20);
        } else if (notebookTitleDiv.classList.contains('display-block')) {
            notebookTitleDiv.setAttribute('style', 'opacity: 0')
            notebookTitleDiv.classList.remove('display-block')
            notebookTitleDiv.classList.add('display-none')
        }
    }

    useEffect(() => {
        if (notebookUuid) {
            const notebookTitleDiv = document.getElementById(`SharedNotes-notebook-content-${notebookUuid}`)
            if (notebookTitleDiv.classList.contains('display-none')) {

                notebookTitleDiv.classList.remove('display-none')
                notebookTitleDiv.classList.add('display-block')
                setTimeout(() => {
                    notebookTitleDiv.setAttribute('style', 'opacity: 1')
                }, 20);

            }

        }

    }, [])

    useEffect(() => {
        if (notebookUuid) {
            socket.on('triggerSharedNotesStateUpdate', data => {
                sharedNotes.setUserSharedNotes(data)
            })
            socket.emit('connectToNotebookRoom', notebookUuid)

        }
        return () => {
            if (notebookUuid) {
                socket.emit('leaveNotebookRoom', (notebookUuid))
            }
        }

    }, [notebookUuid]);


    return (
        <div className="SharedNotes">

            <div className="SharedNotes-header">Shared Notes</div>
            <NewSharedSpace sharedNotes={sharedNotes} />

            <div className="SharedNotes-content" id='SharedNotes-content'>
                {userSharedNotes.map(notebook => {
                    return <div key={notebook.uuid} className='SharedNotes-container-notebook'>
                        <div className='SharedNotes-notebook-header' style={notebook.uuid === notebookUuid ? { backgroundColor: 'rgb(40, 43, 54)' } : undefined}>
                            <div className='SharedNotes-notebook-title' onClick={() => handleNotebookClick(notebook.uuid)} >
                                <div>
                                    <LibraryBooksIcon fontSize='small' className='library-icon' style={notebook.uuid === notebookUuid ? { opacity: '1', color: '#FFBC6F' } : undefined} />
                                    <span>{notebook.title}</span>
                                </div>
                                <span id={`btn-span-${notebook.uuid}`} className="SharedNotes-notebook-btns-span">{btnSpanManage}</span>
                            </div>
                            <div className="SharedNotes-notebook-btns">

                                {notebook.admin_uuid === userContext.data.id && <ManageSharedSpace sharedBook={notebook} setsharedBook={setsharedBook} setBtnSpanManage={setBtnSpanManage} setManageModal={setManageModal} manageModal={manageModal} />}
                                <NewSharedPage sharedBookUuid={notebook.uuid} setBtnSpanManage={setBtnSpanManage} sharedNotes={sharedNotes} />
                            </div>

                        </div>
                        <div className="SharedNotes-notebook-content display-none" id={`SharedNotes-notebook-content-${notebook.uuid}`}>
                            {notebook.pages.length > 0 ?
                                <Notes userNotes={notebook.pages} sharedBookUuid={notebook.uuid} isSharedNotes={isSharedNotes} sharedNotes={sharedNotes} />
                                :
                                <div className='SharedNotes-notebook-no-content'>
                                    <div>No pages here...</div>
                                </div>
                            }
                        </div>

                    </div>
                })}
            </div>
            {manageModal && <div className='SharedNotes-manage-modal' id={`manage-modal-${sharedBook.uuid}`}>

                <ManageSharedSpaceModal setManageModal={setManageModal} sharedBook={sharedBook} sharedNotes={sharedNotes} />

            </div>}
        </div>
    )
}

export default SharedNotes