import TextEditor from './components/TextEditor'
import Navbar from "../../../Navbar/Navbar"
import { useParams } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { useEffect, useState } from 'react';

function NotesContent({ userNotes, sharedNotes }) {
    let { id } = useParams();
    const [height, setHeight] = useState(null)


    useEffect(() => {
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        setHeight(vh)
    }, [])

    return (
        <div className="NotesContent" id='NotesContent'>
            <SimpleBar style={{ maxHeight: height }} >
                <Navbar userNotes={userNotes} sharedNotes={sharedNotes} />

                <div className='NotesContent-editor'>
                    {/* The id url param corresponds to the id of the page selected */}
                    <TextEditor key={id} />

                </div>
            </SimpleBar>
        </div>
    )
}

export default NotesContent
