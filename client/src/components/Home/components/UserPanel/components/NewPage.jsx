import axios from "axios";
import './NewPage.scss'
import AddIcon from '@mui/icons-material/Add';

function NewPage({ setUserNotes }) {

    const handleNewPage = async () => {
        const res = await axios.post('/notes/new', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        if (res.status === 200) {
            const res = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            setUserNotes(res.data[0])

        }
    }


    const handleMouseEnterAdd = () => {
        const addSpan = document.getElementById('add-note')
        addSpan.classList.remove('display-none')
        addSpan.classList.add('display-block')
        setTimeout(() => {
            addSpan.setAttribute('style', 'opacity: 0.6')
        }, 20);
    }

    const handleMouseLeaveAdd = () => {
        const addSpan = document.getElementById('add-note')
        addSpan.setAttribute('style', 'opacity: 0')

        setTimeout(() => {
            addSpan.classList.remove('display-block')
            addSpan.classList.add('display-none')
        }, 50);
    }

    return <div className='NewPage'>
        <span id="add-note" className="display-none">Add Page</span>
        <button onMouseEnter={() => handleMouseEnterAdd()} onMouseLeave={() => handleMouseLeaveAdd()} onClick={handleNewPage}><AddIcon /></button>
    </div>;
}

export default NewPage;
