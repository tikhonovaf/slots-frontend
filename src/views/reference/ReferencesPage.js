import React, {memo, useState} from "react";
import {CContainer, CNav, CNavItem, CNavLink, CTabPane} from "@coreui/react";
import {Tooltip} from "antd";

import {useNavigate} from "react-router";
import {StoresPage} from "./store/StoresPage";
import {ClientsPage} from "./client/ClientsPage";
import {LoadingPointsPage} from "./loading-point/LoadingPointsPage";
import {ClientUsersPage} from "./client-user/ClientUsersPage";

const ReferencesPage = memo(({activeTab}) => {

    const navigate = useNavigate();

    const [activeKey, setActiveKey] = useState(activeTab);
    const [selectedStoreId, setSelectedStoreId] = useState(undefined);
    const [selectedClientId, setSelectedClientId] = useState(undefined);

    const handleStoreSelect = (selectedStoreKeys) => {
        setSelectedStoreId(selectedStoreKeys && selectedStoreKeys.length>0 ? selectedStoreKeys[0] : undefined);
    }
    const handleClientSelect = (selectedClientKeys) => {
        setSelectedClientId(selectedClientKeys && selectedClientKeys.length>0 ? selectedClientKeys[0] : undefined);
    }

    return (
        <CContainer lg>
            {/*<h4 className={"mb-4 mt-2"}> Справочники</h4>*/}

            <CNav className={"mb-3 nav-underline"}>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 1} onClick={() => {
                        setActiveKey(1)
                        navigate("/references");
                    }}>
                        Нефтебазы
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <Tooltip title={"Для просмотра пунктов налива необходимо сначала выбрать нефтебазу"}>
                        <CNavLink
                            href={"#"}
                            active={activeKey === 2}
                            onClick={() => {
                            setActiveKey(2)
                            navigate("/references");
                        }}>
                            Пункты налива
                        </CNavLink>
                    </Tooltip>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 3} onClick={() => {
                        setActiveKey(3)
                        navigate("/references");
                    }}>
                        Клиенты
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 4} onClick={() => {
                        setActiveKey(4)
                        navigate("/references");
                    }}>
                        Пользователи
                    </CNavLink>
                </CNavItem>


{/*
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
*/}

            </CNav>
            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                {activeKey === 1 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 1}>
                        <StoresPage nStoreId={selectedStoreId} onStoreSelect={handleStoreSelect}/>
                    </CTabPane>
                )}

                {activeKey === 2 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 2}>
                        <LoadingPointsPage nStoreId={selectedStoreId}/>
                    </CTabPane>
                )}

                {activeKey === 3 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 3}>
                        <ClientsPage nClientId={selectedClientId} onClientSelect={handleClientSelect}/>
                    </CTabPane>
                )}

                {activeKey === 4 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 4}>
                        <ClientUsersPage nClientId={selectedClientId}/>
                    </CTabPane>
                )}
            </CContainer>
        </CContainer>
    );
})


export default ReferencesPage;
