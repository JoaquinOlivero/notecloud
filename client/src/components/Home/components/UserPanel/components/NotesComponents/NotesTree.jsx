import React, { useEffect, useState } from 'react';
import ArticleIcon from '@mui/icons-material/Article';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useParams, useNavigate } from 'react-router-dom';
import NewSubPage from './NewSubPage';
import DeletePage from './DeletePage';


function NotesTree({ data, setUserNotes, isSharedNotes, sharedBookUuid, sharedNotes }) {
    return <div className='NotesTree'>
        <ul>
            {data.map((note) => (

                <TreeNode node={note} key={note.uuid} setUserNotes={setUserNotes} sharedBookUuid={sharedBookUuid} sharedNotes={sharedNotes} isSharedNotes={isSharedNotes} />
            ))}
        </ul>
    </div>;
}


const TreeNode = ({ node, setUserNotes, isSharedNotes, sharedBookUuid, sharedNotes }) => {
    const [btnSpan, setBtnSpan] = useState(null);
    const [childVisible, setChildVisiblity] = useState(false);

    let { id } = useParams();
    const uuid = id.substring(id.length - 36) //This uuid belongs to the uuid that shows up in the url. Therefore it is the uuid of the active page
    let navigate = useNavigate()

    const hasChild = node.sub_pages.length > 0 ? true : false;

    const handleArrowDropDown = (uuid) => {
        setChildVisiblity(!childVisible)
        const arrowDropDown = document.getElementById(`arrow-${uuid}`)

        childVisible ? arrowDropDown.style.transform = 'rotate(270deg)' : arrowDropDown.style.transform = 'rotate(360deg)'

    }
    const handleOnSelect = (uuid, title) => {
        if (!isSharedNotes) {
            navigate(`/${title}-${uuid}`)
        } else {
            navigate(`/shared-${node.shared_book_uuid}/${uuid}`)
        }
    }

    useEffect(() => {
        // setChildVisibility to true if the uuid of any note inside the parent matches the uuid from the url
        // This shows the 'tree' on the User Panel(left panel) for a page, in case it is nested inside another page (it is the child of another page)
        if (!node.child_of || node.sub_pages.length > 0) {
            const getActiveChild = (tree, target) => {
                if (tree.uuid === target) {
                    return tree.uuid;
                }

                for (const child of tree.sub_pages) {
                    const found = getActiveChild(child, target);

                    if (found) {
                        return found;
                    }
                }

            }

            const test = getActiveChild(node, uuid)
            if (test) {
                setChildVisiblity(true)
            }
        }
    }, []);


    return (
        <li className={childVisible && !node.child_of ? "NotesTree-TreeNode active-node" : "NotesTree-TreeNode"}>
            <div className={uuid === node.uuid ? "NotesTree-TreeNode-container active-note" : "NotesTree-TreeNode-container"} >
                {hasChild ?
                    <div >
                        <div className="TreeNode-container-arrow">

                            <ArrowDropDownIcon id={`arrow-${node.uuid}`} className='arrow-drop-down' onClick={() => { handleArrowDropDown(node.uuid) }} />
                        </div>

                    </div>
                    :
                    <div className="TreeNode-container-arrow">

                        <ArrowDropDownIcon id={`arrow-${node.uuid}`} className='arrow-drop-down' onClick={() => { handleArrowDropDown(node.uuid) }} />
                    </div>
                }

                <div className="TreeNode-note" >
                    <div className='TreeNode-note-content' onClick={() => handleOnSelect(node.uuid, node.blocks[0].data.text)}>
                        <div className="TreeNode-note-icon">
                            <ArticleIcon className='article-icon' style={node.uuid === uuid ? { opacity: '1' } : undefined} />
                        </div>

                        <div className="TreeNode-note-title" id={node.uuid}>
                            {node.blocks[0].data.text}
                        </div>
                    </div>
                    <div className='TreeNode-note-btn-container'>
                        <span id={`btn-span-${node.uuid}`}>{btnSpan}</span>
                        <NewSubPage setBtnSpan={setBtnSpan} uuid={node.uuid} setUserNotes={setUserNotes} sharedBookUuid={sharedBookUuid} isSharedNotes={isSharedNotes} sharedNotes={sharedNotes} />
                        <DeletePage setBtnSpan={setBtnSpan} uuid={node.uuid} setUserNotes={setUserNotes} isSharedNotes={isSharedNotes} sharedNotes={sharedNotes} sharedBookUuid={sharedBookUuid} />
                    </div>

                </div>
            </div>

            {hasChild && childVisible && (
                <div className="NotesTree-TreeNode-Child-container">
                    <ul className="">
                        <NotesTree data={node.sub_pages} setUserNotes={setUserNotes} isSharedNotes={isSharedNotes} sharedNotes={sharedNotes} sharedBookUuid={sharedBookUuid} />
                    </ul>
                </div>
            )}

            {!hasChild && childVisible &&
                <div className='NotesTree-TreeNode-No-Child-container'>
                    <div>No pages here...</div>
                </div>
            }
        </li>
    );
};


export default NotesTree;
