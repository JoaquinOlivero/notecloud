import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import './ManageSharedSpace.scss'

function ManageSharedSpace({ sharedBook, setsharedBook, setBtnSpanManage, setManageModal, manageModal }) {

    const handleManage = async () => {
        await setsharedBook(sharedBook)
        await setManageModal(!manageModal)
        const modal = document.getElementById(`manage-modal-${sharedBook.uuid}`)
        const sharedNotesContainer = document.getElementById('SharedNotes-content')
        setTimeout(() => {
            modal.setAttribute('style', 'opacity: 1')
        }, 20);
        // sharedNotesContainer.classList.add('display-none')
    }

    const handleMouseEnterAdd = () => {
        const addSpan = document.getElementById(`btn-span-${sharedBook.uuid}`)
        addSpan.setAttribute('style', 'opacity: 1')
        setBtnSpanManage('Manage')
    }

    const handleMouseLeaveAdd = () => {
        const addSpan = document.getElementById(`btn-span-${sharedBook.uuid}`)
        addSpan.setAttribute('style', 'opacity: 0')
    }

    return (
        <div className='ManageSharedSpace'>
            <SettingsApplicationsIcon fontSize='small' className='ManageSharedSpace-settings-icon' onMouseEnter={() => handleMouseEnterAdd()} onMouseLeave={() => handleMouseLeaveAdd()} onClick={handleManage} />
        </div>
    )
}

export default ManageSharedSpace