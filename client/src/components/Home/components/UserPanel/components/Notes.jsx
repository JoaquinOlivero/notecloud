import './Notes.scss'
import NotesTree from './NotesComponents/NotesTree';

function Notes({ userNotes, setUserNotes, isSharedNotes, sharedBookUuid, sharedNotes }) {

    return <div className='Notes'>
        <NotesTree data={userNotes} setUserNotes={setUserNotes} sharedBookUuid={sharedBookUuid} sharedNotes={sharedNotes} isSharedNotes={isSharedNotes} />
    </div>;
}

export default Notes;
