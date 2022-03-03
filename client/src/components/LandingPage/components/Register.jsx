import React, { useContext, useState } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import axios from 'axios'
import { TailSpin } from 'react-loader-spinner'

function Register() {
    const [userContext, setUserContext] = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [email, setEmail] = useState(null)
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleRegister = e => {
        e.preventDefault()
        setIsSubmitting(true)
        if (email && username && password && passwordMatch) {
            if (error) {
                setError(null)
            }

            const registerDetails = {
                "email": email,
                "username": username,
                "password": password
            }

            const registerUser = async () => {
                try {
                    const res = await axios.post('/user/signup', registerDetails, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
                    const data = res.data
                    setUserContext(oldValues => {
                        return { ...oldValues, data }
                    })
                    setIsSubmitting(false)
                    window.location.reload(false);
                } catch (error) {
                    setIsSubmitting(false)
                    console.clear()
                    setError({ msg: error.response.data.message })
                }
            }

            registerUser()

        } else if (!email || !username || !password || !passwordMatch) {
            setIsSubmitting(false)
            setError({ msg: 'Please complete your registration details!' })
        }

    }

    const handlePassword = e => {
        const value = e.target.value
        if (value === password || value === '') {
            setPasswordMatch(true)
        } else {
            setPasswordMatch(false)
        }
    }

    return <div className='Register'>
        <div className='Register-content'>
            {error &&
                <div className='Register-error'>{error.msg}</div>
            }
            <form onSubmit={handleRegister} className='Register-form'>
                <div className="Register-form-field">
                    <label htmlFor="">Email</label>
                    <input type="email" name="" id="" placeholder='Enter your email' onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="Register-form-field">
                    <label htmlFor="">Username</label>
                    <input type="text" name="" id="" placeholder='Enter your username' onChange={e => setUsername(e.target.value)} required />
                </div>

                <div className="Register-form-field">
                    <label htmlFor="">Password</label>
                    <input type="password" name="" id="" placeholder='Enter your password' onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="Register-form-field">
                    <label htmlFor="">Repeat Password</label>
                    <input type="password" name="" id="" placeholder='Repeat your password' onChange={e => handlePassword(e)} required />
                    {!passwordMatch && <div className="form-field-error">Passwords do not match!</div>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', widht: '100%' }}>
                    <div className='Register-form-button' onClick={handleRegister}>
                        <button intent='primary' disabled={isSubmitting} type="submit" className={isSubmitting ? 'Login-form-button-isSubmitting' : ''}>Register</button>
                    </div>
                    <div className='Login-form-button-tailspin' style={{ marginLeft: '10px' }}>
                        {isSubmitting && <TailSpin color="#180858" height={25} width={25} />}
                    </div>
                </div>
            </form>

        </div>
    </div>;
}

export default Register;
