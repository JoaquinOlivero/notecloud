import axios from 'axios'
import { useState } from 'react'

function NewSharedSpaceModal({ setModal, sharedNotes }) {
    const [title, setTitle] = useState(null)

    const handleNewSharedNotes = async (e) => {
        e.preventDefault()
        const res = await axios.post('/shared_notes/create', { title: title }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        if (res.status === 200) {
            const modal = document.getElementById('NewSharedSpaceModal')
            const form = document.getElementById('NewSharedSpaceModal-form')

            form.setAttribute('style', 'opacity: 0')
            modal.setAttribute('style', 'height: 0px')

            setTimeout(async () => {
                setModal(false)
                const res2 = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                sharedNotes.setUserSharedNotes(res2.data[1])
            }, 250);
        }
    }

    return (
        <div className='NewSharedSpaceModal' id='NewSharedSpaceModal'>
            <form onSubmit={handleNewSharedNotes} id='NewSharedSpaceModal-form'>
                <input type="text" placeholder='Name your notebook' onChange={(e) => setTitle(e.target.value)} required />
                <button>Create</button>
            </form>
        </div>
    )
}

export default NewSharedSpaceModal