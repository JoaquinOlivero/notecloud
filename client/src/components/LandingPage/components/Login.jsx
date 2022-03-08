import React, { useState, useContext } from 'react';
import axios from 'axios'
import { UserContext } from '../../../contexts/UserContext'
import { TailSpin } from 'react-loader-spinner'


function Login() {
    const [userContext, setUserContext] = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [error, setError] = useState(null);

    const handleLogin = e => {
        e.preventDefault()
        setIsSubmitting(true)

        if (email && password) {
            if (error) {
                setError(null)
            }
            const loginDetails = {
                "email": email,
                "password": password
            }


            const signIn = async () => {

                try {
                    const res = await axios.post('/user/signin', loginDetails, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
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

            signIn()
        } else if (!email || !password) {
            setIsSubmitting(false)
            setError({ msg: 'Please enter your login details!' })
        }


    }

    return <div className='Login'>
        <div className='Login-content'>
            {error &&
                <div className='Login-error'>{error.msg}</div>
            }
            <form onSubmit={handleLogin} className='Login-form'>
                <div className="Login-form-field">
                    <label htmlFor="">Email</label>
                    <input type="email" name="" id="" placeholder='Enter your email' onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="Login-form-field">
                    <label htmlFor="">Password</label>
                    <input type="password" name="" id="" placeholder='Enter your password' onChange={e => setPassword(e.target.value)} required />
                </div>

                <div className='Login-form-button-container'>
                    <div className='Login-form-button' onClick={handleLogin}>
                        <button intent='primary' disabled={isSubmitting} type="submit" className={isSubmitting ? 'Login-form-button-isSubmitting' : ''}>Log In</button>
                        <div className='Login-form-button-tailspin' style={{ marginLeft: '10px' }}>
                            {isSubmitting && <TailSpin color="#180858" height={25} width={25} />}
                        </div>
                    </div>

                </div>
            </form>

        </div>
    </div>;
}

export default Login;
