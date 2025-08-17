import React, {memo, useState} from "react";
import {useNavigate} from "react-router";
import {CContainer, CNav, CNavItem, CNavLink, CTabPane} from "@coreui/react";
import RedisPage from "./RedisPage";
import ClickHousePage from "./ClickHousePage";


const DebugPage = memo(({activeTab}) => {

    const navigate = useNavigate();

    const [activeKey, setActiveKey] = useState(activeTab);

    return (
        <CContainer lg>
            <h4 className={"mb-4 mt-2"}>Отладка</h4>

            <CNav className={"mb-3 nav-underline"}>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 1} onClick={() => {
                        setActiveKey(1)
                        navigate("/debug");
                    }}>
                        Redis
                    </CNavLink>
                </CNavItem>
                <CNavItem>
                    <CNavLink href={"#"} active={activeKey === 2} onClick={() => {
                        setActiveKey(2);
                        navigate("/debug/clickHouse");
                    }}>
                        ClickHouse

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
                {/*    <CNavItem>*/}
                {/*        <CNavLink href={"#"} active={activeKey === 4} onClick={() => {*/}
                {/*            setActiveKey(4);*/}
                {/*            navigate("/settings/traffic");*/}
                {/*        }}>*/}
                {/*            Контроль трафика*/}
                {/*        </CNavLink>*/}
                {/*    </CNavItem>*/}

            </CNav>
            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                {activeKey === 1 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 1}>
                        <RedisPage/>
                    </CTabPane>
                )}

                {activeKey === 2 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 2}>
                        <ClickHousePage/>
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

export default DebugPage;
