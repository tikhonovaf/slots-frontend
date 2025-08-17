import React, {createContext, memo} from "react";
import Login from "../views/login/Login";
import {useCookies} from "react-cookie";
import {SESSION, STORAGE_NAME} from "../constants";


const AuthContext = createContext(null);

export const AuthProvider = memo(({children}) => {

    const [cookies] = useCookies([SESSION])

    if ((!cookies.session || cookies.session === "")
        && (!sessionStorage.getItem(STORAGE_NAME) || sessionStorage.getItem(STORAGE_NAME) === "")) {
        return <Login/>;
    }


    return (
        <AuthContext.Provider>
            {children}
        </AuthContext.Provider>
    );
});

export default AuthContext;
