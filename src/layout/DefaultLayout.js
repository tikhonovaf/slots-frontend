import React from "react";
import {Outlet} from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

import AppFooter from "./AppFooter";

const DefaultLayout = () => {

    return (
        <>
            <AppSidebar/>
            <div className={"wrapper d-flex flex-column min-vh-100 bg-light"}>
                <AppHeader/>
                <div className={"body flex-grow-1 px-5"} >
                    <Outlet/>
                </div>
                <AppFooter/>
            </div>
        </>
    );
};

export default DefaultLayout;
