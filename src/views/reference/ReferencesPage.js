import React, {memo, useState} from "react";
import {CContainer, CNav, CNavItem, CNavLink, CTabPane} from "@coreui/react";

import {useNavigate} from "react-router";
import {VendorsPage} from "./vendor/VendorsPage";
import {ClustersPage} from "./cluster/ClustersPage";
import {MethodsPage} from "./method/MethodsPage";
import {DepartmentsPage} from "./department/DepartmentsPage";
import {RolesPage} from "./role/RolesPage";
import {UsersPage} from "./user/UsersPage";
import {ServersPage} from "./server/ServersPage";


const ReferencesPage = memo(({activeTab}) => {

    const navigate = useNavigate();

    const [activeKey, setActiveKey] = useState(activeTab);

    return (
        <CContainer lg>
            {/*<h4 className={"mb-4 mt-2"}> Справочники</h4>*/}

            <CNav className={"mb-3 nav-underline"}>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 1} onClick={() => {
                        setActiveKey(1)
                        navigate("/references");
                    }}>
                        Кластеры S3
                    </CNavLink>
                </CNavItem>

                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 2} onClick={() => {
                        setActiveKey(2);
                        navigate("/references/vendors");
                    }}>
                        Вендоры S3
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 4} onClick={() => {
                        setActiveKey(4);
                        navigate("/references/records");
                    }}>
                        Методы S3
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 7} onClick={() => {
                        setActiveKey(7)
                        navigate("/references/servers");
                    }}>
                        Серверы S3Hub
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 6} onClick={() => {
                        setActiveKey(6);
                        navigate("/references/users");
                    }}>
                        Пользователи
                    </CNavLink>
                </CNavItem>

                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 5} onClick={() => {
                        setActiveKey(5);
                        navigate("/references/roles");
                    }}>
                        Роли
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 3} onClick={() => {
                        setActiveKey(3);
                        navigate("/references/departments");
                    }}>
                        Отделы
                    </CNavLink>
                </CNavItem>

            </CNav>
            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                {activeKey === 1 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 1}>
                        <ClustersPage/>
                    </CTabPane>
                )}

                {activeKey === 2 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 2}>
                        <VendorsPage/>
                    </CTabPane>
                )}

                {activeKey === 3 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 3}>
                        <DepartmentsPage/>
                    </CTabPane>
                )}

                {activeKey === 4 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 4}>
                        <MethodsPage/>
                    </CTabPane>
                )}

                {activeKey === 5 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 5}>
                        <RolesPage/>
                    </CTabPane>
                )}

                {activeKey === 6 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 6}>
                        <UsersPage/>
                    </CTabPane>
                )}

                {activeKey === 7 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 7}>
                        <ServersPage/>
                    </CTabPane>
                )}


            </CContainer>
        </CContainer>
    );
})


export default ReferencesPage;
