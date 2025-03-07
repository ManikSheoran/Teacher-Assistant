import { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false)
    return (
        <AuthContext.Provider value={{loggedIn, setLoggedIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)