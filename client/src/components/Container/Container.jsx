import { Navigate, Route, Routes } from 'react-router-dom'
import { useState, useContext, useEffect, useCallback } from 'react'
import Home from "../Home/Home"
import LandingPage from '../LandingPage/LandingPage'
import './Container.scss'
import axios from 'axios'



// Contexts
import { UserContext } from '../../contexts/UserContext'
import { SocketContext } from '../../contexts/UserSocketContext'

// router.post('/logout', verifyToken, userController.logout)

function Container() {
    const socket = useContext(SocketContext);
    const [userContext, setUserContext] = useContext(UserContext);
    const [user, setUser] = useState(false);
    const [userNotes, setUserNotes] = useState(null);
    const [userSharedNotes, setUserSharedNotes] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    const checkUser = useCallback(async () => {

        try {
            const res = await axios.post('/user/refreshtoken', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            const data = res.data
            setUserContext(oldValues => {
                return { ...oldValues, data }
            })

            const res2 = await axios.post('/notes/data', { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            //res2.data[0] -> the user's notes // res.data[1] -> the user's shared notebooks/notes
            setUserNotes(res2.data[0])
            setUserSharedNotes(res2.data[1])

            setUser(true)
            setIsFetching(false)
        } catch (error) {
            // console.clear()
            setIsFetching(false)
        }

        // call refreshToken every 20 minutes to renew the authentication token.
        setTimeout(checkUser, 20 * 60 * 1000)
    }, [setUserContext])

    useEffect(() => {
        checkUser()
    }, [checkUser])


    // Set username and user_uuid to socket.io user client
    const socketSetUser = useCallback(() => {
        const userData = userContext.data
        socket.emit('loginUser', userData)
    }, [userContext]);

    useEffect(() => {
        socketSetUser()
    }, [socketSetUser])



    return (
        <div className="Container default-theme">
            {isFetching ? <div>

            </div> :


                <div>
                    {!user ?
                        <Routes>
                            <Route path='/' element={<LandingPage />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                        :
                        <Routes>
                            <Route exact path='/' element={<Navigate to={`/${userNotes[0].blocks[0].data.text}-${userNotes[0].uuid}`} />} />
                            <Route exact path='/:id' element={<Home userNotes={userNotes} setUserNotes={setUserNotes} sharedNotes={{ setUserSharedNotes, userSharedNotes }} />} />
                            <Route exact path='/shared-:notebookUuid/:id' element={<Home userNotes={userNotes} setUserNotes={setUserNotes} sharedNotes={{ setUserSharedNotes, userSharedNotes }} />} />
                        </Routes>
                    }
                </div>
            }
        </div>
    )
}

export default Container
