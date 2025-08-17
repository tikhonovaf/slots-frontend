import React, {memo, useState} from "react";

import {CButton, CContainer, CHeader, CHeaderBrand, CHeaderNav,} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilAccountLogout, cilApplicationsSettings, cilStorage} from "@coreui/icons";

import {AppHeaderDropdown} from "./header";
import {logo} from "../assets/brand/logo";
import CreateOrUpdateCluster from "../views/reference/cluster/CreateOrUpdateCluster";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router";
import {SESSION, STORAGE_NAME} from "../constants";
import {clearStorage} from "../utils/utils";
import CreateOrUpdateVendor from "../views/reference/vendor/CreateOrUpdateVendor";
import CreateOrUpdateMethod from "../views/reference/method/CreateOrUpdateMethod";
import CreateOrUpdateDepartment from "../views/reference/department/CreateOrUpdateDepartment";
import CreateOrUpdateRole from "../views/reference/role/CreateOrUpdateRole";
import CreateOrUpdateUser from "../views/reference/user/CreateOrUpdateUser";
import CreateOrUpdateTrafficRule from "../views/setting/traffic/CreateOrUpdateTrafficRule";
import CreateOrUpdateCloneRule from "../views/s3clone/synch/CreateOrUpdateCloneRule";
import CreateOrUpdateS3KeyRule from "../views/setting/s3key/CreateOrUpdateS3KeyRule";
import CreateOrUpdateBalancingRule from "../views/setting/balancing/CreateOrUpdateBalancingRule";
import CreateOrUpdateAccessRightsRule from "../views/setting/accessRights/CreateOrUpdateAccessRightsRule";
import CreateOrUpdateServer from "../views/reference/server/CreateOrUpdateServer";
import {Button, Dropdown, Space} from "antd";


const AppHeader = memo(() => {

    const navigate = useNavigate();
    const [showNewCluster, setShowNewCluster] = useState(false);
    const [showNewVendor, setShowNewVendor] = useState(false);
    const [showNewServer, setShowNewServer] = useState(false);
    const [showNewUser, setShowNewUser] = useState(false);
    const [showNewRole, setShowNewRole] = useState(false);
    const [showNewDepartment, setShowNewDepartment] = useState(false);
    const [showNewRecordType, setShowNewRecordType] = useState(false);

    const [showNewBalancingRule, setShowNewBalancingRule] = useState(false);
    const [showNewSyncRule, setShowNewSyncRule] = useState(false);
    const [showNewS3KeyRule, setShowNewS3KeyRule] = useState(false);
    const [showNewControlTrafficRule, setShowNewControlTrafficRule] = useState(false);
    const [showNewAccessRightsRule, setShowNewAccessRightsRule] = useState(false);

    const [cookies, , removeCookie] = useCookies([SESSION]);


    const logout = async () => {
        return await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
    };

    const handleLogout = async (e) => {
        removeCookie(SESSION, {path: "/"});
        clearStorage();
        await logout();
        navigate("/");
        window.location.reload()
    };

    const rules = [
        {
            label: 'Маршрутизация и балансировка',
            key: '1',
            // icon: <DataUsageOutlined/>,
            onClick: () => setShowNewBalancingRule(true)

        },
        {
            label: 'Квоты и лимиты',
            key: '2',
            // icon: <DatabaseOutlined/>,
            onClick: () => setShowNewControlTrafficRule(true)

        },
        {
            label: 'Синхронизация',
            key: '3',
            // icon: <SyncOutlined/>,
            onClick: () => setShowNewSyncRule(true)

        }]


    const items = [
        {
            label: 'Новый кластер',
            key: '1',
            // icon: <DataUsageOutlined/>,
            onClick: () => setShowNewCluster(true)

        },
        {
            label: 'Новый сервер',
            key: '1',
            // icon: <DatabaseOutlined/>,
            onClick: () => setShowNewServer(true)

        },
        {
            label: 'Новый метод',
            key: '1',
            // icon: <SyncOutlined/>,
            onClick: () => setShowNewRecordType(true)
        },
        {
            label: 'Новый вендор',
            key: '1',
            // icon: <DataUsageOutlined/>,
            onClick: () => setShowNewVendor(true)

        },
        {
            label: 'Новый пользователь',
            key: '1',
            // icon: <DatabaseOutlined/>,
            onClick: () => setShowNewUser(true)

        },
        {
            label: 'Новая роль',
            key: '1',
            // icon: <SyncOutlined/>,
            onClick: () => setShowNewRole(true)
        },
        {
            label: 'Новый отдел',
            key: '1',
            // icon: <SyncOutlined/>,
            onClick: () => setShowNewDepartment(true)
        }


    ]

    return (
        <>
            <CHeader position={"sticky"} className={"mb-3"}>
                <CContainer
                    fluid
                    className={
                        "d-flex justify-content-end align-items-center header-height"
                    }
                >

                    <Space>
                        <Dropdown menu={{items: rules}}>
                            <Button>
                                <Space>Добавить правило
                                    <CIcon icon={cilApplicationsSettings}/>
                                </Space>
                            </Button>
                        </Dropdown>

                        <Dropdown menu={{items: items}}>
                            <Button>
                                <Space>
                                    Добавить в справочник
                                    <CIcon icon={cilStorage}/>
                                </Space>
                            </Button>
                        </Dropdown>

                        <CHeaderBrand className={"mx-auto d-md-none"} to={"/"}>
                            <CIcon icon={logo} height={48} alt={"Logo"}/>
                        </CHeaderBrand>

                        <CHeaderNav className={"ms-3"}>
                            <AppHeaderDropdown/>
                        </CHeaderNav>

                        <div>
                            <span
                                className={"ms-1"}>{cookies.session?.name || sessionStorage.getItem(STORAGE_NAME)}</span>
                        </div>

                        <CButton className={"ms-2"} onClick={handleLogout} color={"white"}>
                            <CIcon icon={cilAccountLogout} size={"lg"}/>
                        </CButton>
                    </Space>

                </CContainer>
            </CHeader>

            <CreateOrUpdateCluster open={showNewCluster}
                                   onClose={() => {
                                       setShowNewCluster(false);
                                   }}
            />

            <CreateOrUpdateVendor open={showNewVendor}
                                  onClose={() => {
                                      setShowNewVendor(false)
                                  }}/>
            <CreateOrUpdateMethod open={showNewRecordType}
                                  onClose={() => {
                                      setShowNewRecordType(false)
                                  }}/>

            <CreateOrUpdateDepartment open={showNewDepartment}
                                      onClose={() => {
                                          setShowNewDepartment(false)
                                      }}/>

            <CreateOrUpdateRole open={showNewRole}
                                onClose={() => {
                                    setShowNewRole(false)
                                }}/>

            <CreateOrUpdateUser open={showNewUser}
                                onClose={() => {
                                    setShowNewUser(false)
                                }}/>

            <CreateOrUpdateTrafficRule open={showNewControlTrafficRule}
                                       onClose={() => {
                                           setShowNewControlTrafficRule(false)
                                       }}/>

            <CreateOrUpdateCloneRule open={showNewSyncRule}
                                     onClose={() => {
                                         setShowNewSyncRule(false)
                                     }}/>

            <CreateOrUpdateS3KeyRule open={showNewS3KeyRule}
                                     onClose={() => {
                                         setShowNewS3KeyRule(false)
                                     }}/>

            <CreateOrUpdateBalancingRule open={showNewBalancingRule}
                                         onClose={() => {
                                             setShowNewBalancingRule(false)
                                         }}/>

            <CreateOrUpdateAccessRightsRule open={showNewAccessRightsRule}
                                            onClose={() => {
                                                setShowNewAccessRightsRule(false)
                                            }}/>

            <CreateOrUpdateServer open={showNewServer}
                                  onClose={() => setShowNewServer(false)}/>

        </>
    );
});

export default AppHeader;
