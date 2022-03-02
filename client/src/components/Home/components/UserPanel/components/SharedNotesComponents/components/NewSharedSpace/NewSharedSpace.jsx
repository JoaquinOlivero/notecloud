import AddIcon from '@mui/icons-material/Add';
import './NewSharedSpace.scss'
import axios from 'axios';
import NewSharedSpaceModal from './NewSharedSpaceModal';
import { useState } from 'react';

function NewSharedSpace({ sharedNotes }) {
    const [modal, setModal] = useState(false)

    const handleClickOnIcon = async () => {

        if (!modal) {

            await setModal(true)
            const modal = document.getElementById('NewSharedSpaceModal')

            setTimeout(() => {
                modal.setAttribute('style', 'height: 80px')
            }, 20);
            setTimeout(() => {
                const form = document.getElementById('NewSharedSpaceModal-form')
                form.setAttribute('style', 'opacity: 1')
            }, 150);

        } else {
            const modal = document.getElementById('NewSharedSpaceModal')
            const form = document.getElementById('NewSharedSpaceModal-form')

            form.setAttribute('style', 'opacity: 0')
            modal.setAttribute('style', 'height: 0px')

            setTimeout(async () => {
                setModal(false)
            }, 250);

        }
    }


    const handleMouseEnterAdd = () => {
        const addSpan = document.getElementById('add-shared-note')
        addSpan.classList.remove('display-none')
        addSpan.classList.add('display-block')
        setTimeout(() => {
            addSpan.setAttribute('style', 'opacity: 0.6')
        }, 20);
    }

    const handleMouseLeaveAdd = () => {
        const addSpan = document.getElementById('add-shared-note')
        addSpan.setAttribute('style', 'opacity: 0')

        setTimeout(() => {
            addSpan.classList.remove('display-block')
            addSpan.classList.add('display-none')
        }, 50);
    }

    return (
        <div className='NewSharedSpace'>
            <div className='NewSharedSpace-btn'>
                <span id="add-shared-note" className="display-none">Create a notebook to share notes</span>
                <button onMouseEnter={() => handleMouseEnterAdd()} onMouseLeave={() => handleMouseLeaveAdd()} onClick={handleClickOnIcon}><AddIcon /></button>
            </div>
            {modal && <NewSharedSpaceModal setModal={setModal} sharedNotes={sharedNotes} />}
        </div>
    )
}

export default NewSharedSpace