import React, { useEffect, useState } from 'react';
import './SearchNotes.scss'
import axios from 'axios';

function SearchNotes({ setFetching, setSearchResult, query, setQuery }) {

    const [displayMessage, setDisplayMessage] = useState("");

    const searchNotes = async (searchValue) => {
        const res = await axios.post('/notes/search', { searchValue: searchValue }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
        setSearchResult(res.data)
        setFetching(false)

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


    return <div className='SearchNotes'>
        <input type="text" placeholder='Quick search...' onChange={e => { setQuery(e.target.value); e.target.value.length > 0 ? setFetching(true) : setFetching(false); setSearchResult(null) }} value={query} />
    </div>;
}

export default SearchNotes;
