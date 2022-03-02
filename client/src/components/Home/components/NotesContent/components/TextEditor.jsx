import { useCallback, useContext, useEffect, useState } from 'react'
import { useRef } from 'react'
import { createReactEditorJS } from 'react-editor-js'
import { EDITOR_JS_TOOLS } from './tools'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import './TextEditor.scss'


// Socket.io
import { SocketContext } from '../../../../../contexts/UserSocketContext'

function TextEditor() {
    const socket = useContext(SocketContext);
    const [notes, setNotes] = useState(null);
    const editorJS = useRef(null)
    const editorEvents = useRef(null)
    const savedBlocks = useRef(null)
    const blockUpdate = useRef(true)
    let { id, notebookUuid } = useParams();
    const uuid = id.substring(id.length - 36) //This uuid belongs to the uuid that shows up in the url

    const getNotes = async () => {
        if (!notebookUuid) {

            const res = await axios.post('/notes/single', { url: id }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            setNotes(res.data)
        } else {
            const res = await axios.post('/shared_notes/single', { uuid: id }, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            setNotes(res.data)

        }
    }

    useEffect(() => {
        if (!notes) {
            getNotes()
        }
    }, [notes]);


    // Settings for editor on initialization
    const handleInitialize = useCallback(async (instance) => {
        editorJS.current = instance
    }, [])

    // Editor's onChange function
    const handleChange = useCallback(async (e, customEvt, socketOnChange) => {

        editorEvents.current = e
        const pageTitle = document.getElementById('page-title')
        const noteTitle = document.getElementById(`${uuid}`)

        if (!pageTitle.innerText.length) {
            noteTitle.innerText = 'Untitled'
        } else {
            noteTitle.innerText = pageTitle.innerText
        }

        pageTitle.addEventListener('keydown', evt => {

            if (customEvt.selected && evt.keyCode === 8) {
                evt.stopPropagation()
            }
        })

        const savedData = await editorJS.current.save();
        const data = { savedData: savedData, url: id }

        const saveDataToDb = async () => {
            if (!notebookUuid) {
                await axios.post('/notes/save', data, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            } else {
                await axios.post('/shared_notes/save', data, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            }
        }

        savedBlocks.current = savedData
        if (blockUpdate.current === false) await saveDataToDb();

        if (socketOnChange && blockUpdate.current === false) {

            const currentBlockIndex = e.blocks.getCurrentBlockIndex()
            const getCurrentBlock = await e.blocks.getBlockByIndex(currentBlockIndex).save()

            const currentBlockData = { blockIndex: currentBlockIndex, url: id, block: { id: getCurrentBlock.id, type: getCurrentBlock.tool, data: getCurrentBlock.data } }
            socketOnChange.emit('textEditorData', { currentBlockData: currentBlockData, savedData: savedData })

        } else if (socketOnChange && blockUpdate.current === true) {
            blockUpdate.current = false
        }


    }, [])

    useEffect(() => {
        // socket.on('externalBlocks', async (blocks) => {
        socket.on('externalBlocks', async (data) => {
            const blockIndex = editorEvents.current.blocks.getBlockByIndex(data.currentBlockData.blockIndex)
            if (savedBlocks.current.blocks.length === data.savedData.blocks.length) {
                if (blockIndex) {
                    blockUpdate.current = true
                    editorEvents.current.blocks.update(data.currentBlockData.block.id, data.currentBlockData.block.data)
                } else {
                    blockUpdate.current = true
                    editorJS.current.render(data.savedData)
                }
            } else {
                savedBlocks.current.blocks = data.savedData.blocks
                blockUpdate.current = true
                editorJS.current.render(data.savedData)
            }

        })


    }, [])

    // Runs once the editor instance is ready to be used. (Runs after the handleInitialize function)
    const handleOnReady = () => {

        // Disables removal of pageTitle block
        const pageTitle = document.getElementById('page-title')
        if (pageTitle) {
            // Disable title block removal
            pageTitle.addEventListener('keydown', evt => {
                if (pageTitle.innerText.length === 0 && evt.keyCode === 8) {
                    evt.stopPropagation()
                } else if (pageTitle.innerText.length === 0 && evt.keyCode === 13) {
                    evt.stopPropagation()
                    evt.preventDefault()
                }
            })

            // Disable title block selection
            document.onselectstart = () => {
                // const pageTitle = document.getElementById('page-title')
                const parent = pageTitle.parentNode.parentNode
                parent.classList.remove('ce-block--selected')
                parent.onmousemove = () => {
                    if (parent.className === 'ce-block ce-block--selected') {
                        parent.classList.remove('ce-block--selected')
                    }
                }
                parent.onmouseenter = () => {
                    parent.classList.remove('ce-block--selected')
                }
                parent.onmouseleave = () => {
                    parent.classList.remove('ce-block--selected')
                }
                document.onmouseup = () => {
                    parent.classList.remove('ce-block--selected')
                }
            }
        }

        const contenteditable = document.querySelectorAll('[contenteditable]')
        const text = contenteditable[contenteditable.length - 1].innerText
        contenteditable[contenteditable.length - 1].innerText = `${text} `
        setTimeout(() => {
            contenteditable[contenteditable.length - 1].innerText = text
        }, 100);

    }



    useEffect(() => {
        const connectToRoom = async () => {
            if (notebookUuid && notes && editorJS) {
                socket.emit('connectToTextEditorRoom', (notes.uuid))

            }
        }
        connectToRoom()

        return () => {
            if (notebookUuid && notes) {
                socket.emit('leaveTextEditorRoom', (notes.uuid))
            }
        }

    }, [notes, editorJS, notebookUuid, socket, id])

    const ReactEditorJS = createReactEditorJS()
    return (
        <div>
            {notes && !notebookUuid &&
                <ReactEditorJS
                    tools={EDITOR_JS_TOOLS}
                    defaultValue={{ blocks: notes.blocks }}
                    onInitialize={handleInitialize}
                    onReady={handleOnReady}
                    onChange={(e, customEvt) => { handleChange(e, customEvt, socket) }}
                    logLevel='ERROR'
                />
            }

            {notes && notebookUuid &&
                <ReactEditorJS
                    enable
                    tools={EDITOR_JS_TOOLS}
                    defaultValue={{ blocks: notes.blocks }}
                    onInitialize={handleInitialize}
                    onReady={handleOnReady}
                    onChange={(e, customEvt) => { handleChange(e, customEvt, socket) }}
                    logLevel='ERROR'
                />
            }
            {notes && <></>}
        </div>
    )
}

export default TextEditor
