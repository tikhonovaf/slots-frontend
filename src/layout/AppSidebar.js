import React, {useState} from "react";

import {CNavItem, CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler,} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {AppSidebarNav} from "./AppSidebarNav";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import {cilApplicationsSettings, cilClone, cilDescription, cilDiamond, cilHouse, cilStorage,} from "@coreui/icons";

const AppSidebar = () => {

    const navigation = [
        {
            component: CNavItem,
            name: "Мониторинг",
            to: "/",
            icon: <CIcon icon={cilHouse} customClassName={"nav-icon"}/>,
        },
        {
            component: CNavItem,
            name: "Слоты",
            to: "/slots",
            icon: <CIcon icon={cilHouse} customClassName={"nav-icon"}/>,
        },
        {
            component: CNavItem,
            name: "Правила",
            to: "/settings",
            icon: <CIcon icon={cilApplicationsSettings} customClassName={"nav-icon"}/>,
        },
        {
            component: CNavItem,
            name: "Быстрая копия",
            to: "/s3clone",
            icon: <CIcon icon={cilClone} customClassName={"nav-icon"}/>,
        },
        {
            component: CNavItem,
            name: "Справочники",
            to: "/references",
            icon: <CIcon icon={cilStorage} customClassName={"nav-icon"}/>,
        },
        {
            component: CNavItem,
            name: "Отчеты",
            to: "/reports",
            icon: <CIcon icon={cilDescription} customClassName={"nav-icon"}/>,
        },
        {
            component: CNavItem,
            name: "Отладка",
            to: "/debug",
            icon: <CIcon icon={cilDiamond} customClassName={"nav-icon"}/>,
        },

    ];

    const [open, setOpen] = useState(true);
    const [narrow, setNarrow] = useState(true);

    return (
        <CSidebar
            position={"fixed"}
            narrow={narrow}
            visible={true}
            onVisibleChange={(visible) => {
                setNarrow(!visible)
            }}
        >
            <CSidebarBrand className={"justify-content-start"} to={"/"}>
                <h5 style={{margin: '5px 0 0 65px', letterSpacing: '7px'}}>S3HUB</h5>
                {/*<CCardLink href={"/"} className={"pt-4 ps-4"}>*/}
                {/*    <CIcon*/}
                {/*        className={"sidebar-brand-full"}*/}
                {/*        icon={logoNegative}*/}
                {/*        height={40}*/}
                {/*    />*/}
                {/*    <CIcon className={"sidebar-brand-narrow"} icon={sygnet} height={35}/>*/}
                {/*</CCardLink>*/}
            </CSidebarBrand>

            <CSidebarNav>
                <SimpleBar>
                <AppSidebarNav items={navigation}/>
                </SimpleBar>
            </CSidebarNav>
            <CSidebarToggler
                className={"d-none d-lg-flex"}
                onClick={() => setNarrow(!narrow)}
            />
        </CSidebar>
    );
};

export default React.memo(AppSidebar);
