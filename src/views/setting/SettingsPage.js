import React, {memo, useState} from "react";
import {CContainer, CNav, CNavItem, CNavLink, CTabPane} from "@coreui/react";

import {useNavigate} from "react-router";
import BucketBalancePage from "./balancing/BucketBalancePage";
import TrafficControlPage from "./traffic/TrafficControlPage";
import AccessRightsPage from "./accessRights/AccessRightsPage";
import {DatabaseOutlined} from "@ant-design/icons";


const SettingsPage = memo(({activeTab}) => {

    const navigate = useNavigate();

    const [activeKey, setActiveKey] = useState(activeTab);

    return (
        <CContainer lg>
            {/*<h4 className={"mb-4 mt-2"}> Настройки правил</h4>*/}

            <CNav className={"mb-3 nav-underline"}>

                <CNavItem>
                    <CNavLink href={"#"}
                              active={activeKey === 1} onClick={() => {
                        setActiveKey(1);
                        navigate("/settings/balance");
                    }}>
                        {/*<CIcon icon={<DataUsageOutlined/>} />*/}
                        Маршрутизация и балансировка
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"}
                              icon={<DatabaseOutlined/>}
                              active={activeKey === 4} onClick={() => {
                        setActiveKey(4);
                        navigate("/settings/traffic");
                    }}>
                        Лимиты и квоты
                    </CNavLink>
                </CNavItem>
                {/*<CNavItem>*/}
                {/*    <CNavLink href={"#"}*/}
                {/*              icon={<SyncOutlined/>}*/}
                {/*              active={activeKey === 3} onClick={() => {*/}
                {/*        setActiveKey(3);*/}
                {/*        navigate("/settings/synch");*/}
                {/*    }}>*/}
                {/*        Синхронизация*/}
                {/*    </CNavLink>*/}
                {/*</CNavItem>*/}
                {/*<CNavItem>*/}
                {/*    <CNavLink href={"#"} active={activeKey === 1} onClick={() => {*/}
                {/*        setActiveKey(1)*/}
                {/*        navigate("/settings");*/}
                {/*    }}>*/}
                {/*        Ключи S3*/}
                {/*    </CNavLink>*/}
                {/*</CNavItem> */}

                {/*<CNavItem>*/}
                {/*    <CNavLink href={"#"} active={activeKey === 5} onClick={() => {*/}
                {/*        setActiveKey(5);*/}
                {/*        navigate("/settings/access");*/}
                {/*    }}>*/}
                {/*        Права пользователей*/}
                {/*    </CNavLink>*/}
                {/*</CNavItem>*/}
            </CNav>
            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                {/*{activeKey === 1 && (*/}
                {/*    <CTabPane role={"tabpanel"} visible={activeKey === 1}>*/}
                {/*        <S3KeysPage/>*/}
                {/*    </CTabPane>*/}
                {/*)}*/}

                {activeKey === 1 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 1}>
                        <BucketBalancePage/>
                    </CTabPane>
                )}

                {/*{activeKey === 3 && (*/}
                {/*    <CTabPane role={"tabpanel"} visible={activeKey === 3}>*/}
                {/*        <BucketClonePage/>*/}
                {/*    </CTabPane>*/}
                {/*)}*/}

                {activeKey === 4 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 4}>
                        <TrafficControlPage/>
                    </CTabPane>
                )}

                {activeKey === 5 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 5}>
                        <AccessRightsPage/>
                    </CTabPane>
                )}


            </CContainer>
        </CContainer>
    );
})


export default SettingsPage;
