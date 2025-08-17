import React, {memo, useState} from "react";
import {useNavigate} from "react-router";
import {CContainer, CNav, CNavItem, CNavLink, CTabPane} from "@coreui/react";
import BucketBalanceReportPage from "./BucketBalanceReportPage";
import TrafficControlReportPage from "./TrafficControlReportPage";
import Audit from "./Audit";


const ReportsPage = memo(({activeTab}) => {

    const navigate = useNavigate();

    const [activeKey, setActiveKey] = useState(activeTab);

    return (
        <CContainer lg>
            <h4 className={"mb-4 mt-2"}>Отчеты</h4>

            <CNav className={"mb-3 nav-underline"}>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 1} onClick={() => {
                        setActiveKey(1)
                        navigate("/reports");
                    }}>
                        Лимиты и квоты
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 2} onClick={() => {
                        setActiveKey(2);
                        navigate("/reports/balance");
                    }}>
                        Маршрутизация и балансировка

                    </CNavLink>
                </CNavItem>
                {/*    <CNavItem>*/}
                {/*        <CNavLink href={"#"} active={activeKey === 3} onClick={() => {*/}
                {/*            setActiveKey(3);*/}
                {/*            navigate("/settings/synch");*/}
                {/*        }}>*/}
                {/*            Синхронизация между кластерами*/}
                {/*        </CNavLink>*/}
                {/*    </CNavItem>*/}
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 3} onClick={() => {
                        setActiveKey(3);
                        navigate("/reports/audit");
                    }}>
                        Аудит действий
                    </CNavLink>
                </CNavItem>

            </CNav>
            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                {activeKey === 1 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 1}>
                        <TrafficControlReportPage/>
                    </CTabPane>
                )}

                {activeKey === 2 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 2}>
                        <BucketBalanceReportPage/>
                    </CTabPane>
                )}

                {activeKey === 3 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 3}>
                        <Audit/>
                    </CTabPane>
                )}

                {/*{activeKey === 3 && (*/}
                {/*    <CTabPane role={"tabpanel"} visible={activeKey === 3}>*/}
                {/*        <BucketClonePage/>*/}
                {/*    </CTabPane>*/}
                {/*)}*/}

                {/*{activeKey === 4 && (*/}
                {/*    <CTabPane role={"tabpanel"} visible={activeKey === 4}>*/}
                {/*        <TrafficControlPage/>*/}
                {/*    </CTabPane>*/}
                {/*)}*/}


            </CContainer>
        </CContainer>
    );
})

export default ReportsPage;
