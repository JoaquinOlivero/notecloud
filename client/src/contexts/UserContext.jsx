import React, { useState } from 'react'

const UserContext = React.createContext([{}, () => { }])

let initialState = {}

function UserProvider(props) {
    const [state, setState] = useState(initialState)
    return (
        <div>
            <UserContext.Provider value={[state, setState]}>
                {props.children}
            </UserContext.Provider>
        </div>
    )
}

export { UserContext, UserProvider }
