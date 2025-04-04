import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: true,
        username: '',
        role: '',
        name: '',
        surname: ''
    });

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.username) {
            setAuth({
                isAuthenticated: true,
                username: userInfo.username,
                role: userInfo.role,
                name: userInfo.name,
                surname: userInfo.surname
            });
        } else {
            setAuth({
                isAuthenticated: false,
                username: '',
                role: '',
                name: '',
                surname: ''
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
