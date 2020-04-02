import React, { useState } from 'react';

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {} //isAuth & login props: không có cũng đc
});


const AuthContextProvider = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loginHandler = () => {
        setIsAuthenticated(true);
    };

    return(
        <AuthContext.Provider value={{login: loginHandler, isAuth: isAuthenticated}}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;