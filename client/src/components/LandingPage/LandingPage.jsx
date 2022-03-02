import React, { useState } from 'react'
import './LandingPage.scss'
import Features from './components/Features'
import Login from './components/Login'
import Register from './components/Register'

function LandingPage() {
    const [loginTab, setLoginTab] = useState(true)

    const changeTab = e => {
        if (loginTab && e.target.innerText === 'Register') {
            setLoginTab(false)
        } else if (!loginTab && e.target.innerText === 'Login') {
            setLoginTab(true)
        }

    }
    return (
        <div className='LandingPage'>

            <div className='LandingPage-left-side'>
                <div className="LandingPage-left-side-content">
                    <div className='LandingPage-content-first'>
                        <h1>NoteCloud</h1>
                        <p>The place to massively share notes!</p>
                    </div>
                    <Features />

                </div>


            </div>
            <div className='LandingPage-right-side'>
                <div className="LandingPage-right-side-content">
                    <div className="right-side-content-tabs">
                        <div className={loginTab ? "tabs-login selected-tab" : 'tabs-login'} onClick={changeTab}>Login</div>
                        <div className={loginTab ? "tabs-register" : "tabs-register selected-tab"} onClick={changeTab}>Register</div>
                    </div>
                    {loginTab ? <Login /> : <Register />}
                </div>

            </div>
        </div>
    )
}

export default LandingPage
