import React, {useEffect, useRef, useState} from "react";

import {useCookies} from "react-cookie";
import {CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CFormCheck, CFormInput, CRow} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {logo} from "../../assets/brand/logo";
import background from "../../assets/images/bg_login.jpg";
import {
    SESSION,
    STORAGE_LICENSE_EXP_DATE,
    STORAGE_LICENSE_INFO,
    STORAGE_LICENSE_STATUS,
    STORAGE_LOCALE,
    STORAGE_NAME,
    STORAGE_ORGANIZATION_ID,
    STORAGE_ORGANIZATION_NAME,
    STORAGE_ROLE,
    STORAGE_ROLE_ID,
    STORAGE_USER_NAME
} from "../../constants";
import {clearStorage} from "../../utils/utils";
import {Button, message} from "antd";


const Login = () => {

    const [cookies, setCookie, removeCookie] = useCookies([SESSION]);
    const [saveInCookies, setSaveInCookies] = useState(true)
    const [loginInProgress, setLoginInProgress] = useState(false)
    const usernameInput = useRef(null);
    const passwordInput = useRef(null);

    useEffect(() => {
        const listener = event => {
            if (event.code === "Enter" || event.code === "NumpadEnter") {
                event.preventDefault();
                handleLogin(event).then()
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, []);

    console.log("loginInProgress", loginInProgress)

    const handleLogin = async (e) => {

        setLoginInProgress(true)
        const loginResponse = await fetch("/api/login",
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                method: "POST",
                body: JSON.stringify({
                    username: usernameInput.current?.value,
                    password: passwordInput.current?.value,
                }),
            })

        console.log("loginResponse.status", loginResponse.status)

        setLoginInProgress(false)
        if (loginResponse.status !== 200) {

            message.error(`Ошибка сервера ${loginResponse.status}. Обратитесь к администратору`)
            removeCookie('session', {path: '/'});
            sessionStorage.removeItem(SESSION)
            return
        }

        const session = await fetch("/api/session",
            {
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                method: "GET"
            })

        session.text()
            .then((data) => {
                const sessionData = JSON.parse(data)

                if (saveInCookies) {
                    setCookie(SESSION, sessionData, {path: "/"})
                    clearStorage();
                } else {
                    sessionStorage.setItem(STORAGE_NAME, sessionData?.name);
                    sessionStorage.setItem(STORAGE_ORGANIZATION_ID, sessionData?.orgId);
                    sessionStorage.setItem(STORAGE_ORGANIZATION_NAME, sessionData?.orgName);
                    sessionStorage.setItem(STORAGE_ROLE, sessionData?.role);
                    sessionStorage.setItem(STORAGE_ROLE_ID, sessionData?.roleId);
                    sessionStorage.setItem(STORAGE_USER_NAME, sessionData?.username);
                    sessionStorage.setItem(STORAGE_LOCALE, sessionData?.lang);
                    sessionStorage.setItem(STORAGE_LICENSE_EXP_DATE, sessionData?.accessKeyExpiredDate);
                    sessionStorage.setItem(STORAGE_LICENSE_STATUS, sessionData?.licStatus);
                    sessionStorage.setItem(STORAGE_LICENSE_INFO, sessionData?.licInfo);
                    removeCookie(SESSION, {path: "/"});
                    window.location.reload()
                }

            })
    };

    return (
        <CForm>
            <div
                className={"bg-light min-vh-100 d-flex flex-row align-items-center"}
                style={{backgroundImage: `url(${background})`}}>
                <CContainer className={"min-vh-100min-vh-100 "}>
                    <CRow className={"justify-content-center"}>
                        <CCol md={4}>
                            <CCardGroup>
                                <CCard className={"p-4 mb-xl-5"}>
                                    <CCardBody>
                                        <div className={"d-flex justify-content-center"}>
                                            <CIcon icon={logo} height={25}/>
                                        </div>
                                        <div className={"d-flex justify-content-center mb-4"}>
                                            <h1>s3hub</h1>
                                        </div>
                                        <div className={"mb-3"}>
                                            <CFormInput
                                                ref={usernameInput}
                                                label={"Логин"}
                                                type={"text"}
                                            />
                                        </div>
                                        <div className={"mb-5"}>
                                            <CFormInput
                                                ref={passwordInput}
                                                label={"Пароль"}
                                                type={"password"}
                                            />
                                        </div>
                                        <CRow>
                                            <CCol xs={12}>
                                                <CFormCheck
                                                    color={"warning"}
                                                    checked={saveInCookies}
                                                    onChange={(e) => {
                                                        setSaveInCookies(e.target.checked)
                                                    }}
                                                    label={"Запомнить меня"}
                                                />
                                            </CCol>
                                            {/*<CCol xs={6} className={"text-right"}>*/}
                                            {/*    /!*<CCardLink*!/*/}
                                            {/*    /!*    href={"#"}*!/*/}
                                            {/*    /!*    color={"warning"}*!/*/}
                                            {/*    /!*    className={"px-0 fw-medium text-decoration-none"}*!/*/}
                                            {/*    /!*>*!/*/}
                                            {/*    /!*    Забыли пароль?*!/*/}
                                            {/*    /!*</CCardLink>*!/*/}
                                            {/*</CCol>*/}
                                        </CRow>
                                        <CRow>
                                            <div className={"d-grid gap-2 mt-4"}>
                                                <Button
                                                    // className={"mt-4 mb-4 text-white"}
                                                    // color={"primary"}
                                                    onClick={() => {

                                                        handleLogin()
                                                    }}

                                                    loading={loginInProgress || false}
                                                    disabled={loginInProgress || false}
                                                >
                                                    Войти
                                                </Button>
                                            </div>
                                        </CRow>

                                        {/*<div className={"ms-auto"}>*/}
                                        {/*    <span className={"me-1"}></span>*/}
                                        {/*    <a*/}
                                        {/*        href={"#"}*/}
                                        {/*        target={"_blank"}*/}
                                        {/*        rel={"noopener noreferrer"}*/}
                                        {/*        className={"fw-medium ms-3 text-decoration-none"}*/}
                                        {/*    >*/}
                                        {/*        {i18next.t('button_login_sso.label')}*/}
                                        {/*    </a>*/}
                                        {/*</div>*/}
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CCol>
                    </CRow>
                    <div className={"d-flex justify-content-center mt-5"}>
                        <span className={"ms-1"}>s3hub ©2024</span>
                    </div>
                </CContainer>
            </div>
        </CForm>
    )
}

export default Login;
