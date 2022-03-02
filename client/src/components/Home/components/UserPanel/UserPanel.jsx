import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import Notes from './components/Notes'
import NewPage from './components/NewPage'
import SearchNotes from './components/SearchNotes';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSettings from './components/UserSettings';
import SharedNotes from './components/SharedNotesComponents/SharedNotes';



function UserPanel({ userNotes, setUserNotes, sharedNotes }) {
    let navigate = useNavigate()
    const [isFetching, setFetching] = useState(false)
    const [searchResult, setSearchResult] = useState(null)
    const [query, setQuery] = useState("");

    const handleChevronClick = () => {
        const userPanel = document.getElementById('UserPanel')
        const notesContent = document.getElementById('NotesContent')
        const homeChevron = document.getElementById('Home-chevron')
        const notes = document.getElementById("UserPanel-notes");
        const sharedNotes = document.getElementById("UserPanel-SharedNotes");
        const navbarContainer = document.getElementById("Navbar");
        userPanel.setAttribute('style', 'width: 0px')
        notesContent.setAttribute('style', 'margin: 0')
        homeChevron.setAttribute('style', 'opacity: 1')
        notes.setAttribute('style', 'opacity: 0')
        sharedNotes.setAttribute('style', 'opacity: 0')
        navbarContainer.setAttribute('style', 'width: 100%')
    }

    const handleClickSearchResult = (title, uuid) => {
        navigate(`/${title}-${uuid}`)
        setSearchResult(null)
        setQuery('')
    }


    return (
        <div className="UserPanel" id='UserPanel'>
            <DoubleArrowIcon className='UserPanel-chevron' onClick={handleChevronClick} />
            <div className="UserPanel-user">
                <UserSettings />
            </div>





            <div className="UserPanel-notes" id='UserPanel-notes'>
                <div className='UserPanel-notes-search'>
                    <div className='UserPanel-notes-header'>My Notes</div>
                    <NewPage setUserNotes={setUserNotes} />
                    <SearchNotes setFetching={setFetching} setSearchResult={setSearchResult} query={query} setQuery={setQuery} />
                </div>
                <div className='UserPanel-notes-content'>
                    {!isFetching && !searchResult ?
                        <Notes userNotes={userNotes} setUserNotes={setUserNotes} />
                        :
                        <div>
                            {!isFetching && searchResult ?
                                <div>
                                    <span className='UserPanel-search-span-found'>Found ({searchResult.length})</span>
                                    {searchResult.map(note => {
                                        return <div key={note.uuid} className='UserPanel-search-container'>
                                            <div onClick={() => handleClickSearchResult(note.blocks[0].data.text, note.uuid)}>
                                                {note.blocks[0].data.text}
                                            </div>
                                        </div>
                                    })}
                                </div>
                                :
                                <div className='UserPanel-content-spinner'>
                                    <CircularProgress size={'25px'} color='inherit' />
                                </div>
                            }
                        </div>
                    }




                </div>

            </div>

            <div className="UserPanel-SharedNotes" id='UserPanel-SharedNotes'>
                <SharedNotes sharedNotes={sharedNotes} />
            </div>

        </div>
    )
}

export default UserPanel
