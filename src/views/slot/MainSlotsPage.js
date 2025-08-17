import React, {memo, useState} from "react";
import {CContainer, CNav, CNavItem, CNavLink, CTabPane} from "@coreui/react";

import {useNavigate} from "react-router";
import {SlotsPage} from "./slot/SlotsPage";


const MainSlotsPage = memo(({activeTab}) => {

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
                        Слоты
                    </CNavLink>
                </CNavItem>
            </CNav>
            <CContainer className={"bg-white pt-3 ps-3 pe-3 pb-3 container"}>

                {activeKey === 1 && (
                    <CTabPane role={"tabpanel"} visible={activeKey === 1}>
                        <SlotsPage/>
                    </CTabPane>
                )}
            </CContainer>
        </CContainer>
    );
})

export default MainSlotsPage;
