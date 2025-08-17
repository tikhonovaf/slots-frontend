import {CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useCallback, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Drawer, message, Spin, Tag} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {ServerUrlsTable} from "../../../components/ServerUrlsTable";

import {useServerTypes} from "../../../hooks/reference/server/useServerTypes";
import {useCreateServer} from "../../../hooks/reference/server/useCreateServer";
import {useUpdateServer} from "../../../hooks/reference/server/useUpdateServer";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";
import {useNavigate} from "react-router";


const CreateOrUpdateServer = memo(({
                                       open,
                                       data,
                                       onClose
                                   }) => {

    const navigate = useNavigate();

    const [newServer, setNewServer] = useState();
    const [connectionStatus, setConnectionStatus] = useState();
    const [checkConnectionInProgress, setCheckConnectionInProgress] = useState(true);
    const [initConnectionCheck, setInitConnectionCheck] = useState(false);
    const createServer = useCreateServer();
    const updateServer = useUpdateServer();
    const [serverTypes, serverTypesStatus] = useServerTypes();

    const doCheckConnection = useCallback(() => {
        setCheckConnectionInProgress(true)
        if (!(newServer && newServer?.serverUrls && newServer?.serverUrls.length > 0)) {
            setCheckConnectionInProgress(false)
            return
        }
        const address = newServer?.serverUrls[0].url + ":" + newServer?.serverUrls[0].port

        const data$ = fromFetch(`${address}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            },

        }).pipe(switchMap(response => {
            if (response.ok) {
                // OK return data
                return response.json();
            } else {
                // Server is returning a status requiring the client to try something else.
                return of({error: true, message: `Error ${response.status}`});
            }
        }), catchError(err => {
            // Network or other error, handle appropriately
            return of({error: true, message: err.message})
        }));

        data$.subscribe({
            next: result => {
                setConnectionStatus(result.error ? "ERR" : result?.status)
            },
            complete: () => {
                setCheckConnectionInProgress(false)
            }
        });

    }, [newServer])


    useEffect(() => {
        if (data) {
            setNewServer(data)
            setInitConnectionCheck(true)
        } else {
            setNewServer({
                ...newServer,
                serverUrls: [{
                    addressRegExp: "",
                    isRegExp: false,
                    url: "",
                    port: ''
                }]
            });
        }
    }, [data]);

    useEffect(() => {
        if (initConnectionCheck) {
            setInitConnectionCheck(false)
            doCheckConnection()
        }
    }, [initConnectionCheck])


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {

            if (!newServer?.serverUrls || newServer?.serverUrls.length === 0) {
                message.error("Укажите адрес сервера")
                return
            }
            const errors = newServer?.serverUrls.filter(item => !item.port || item.port === "" || item.url === "http://" || item.url === "https://")
            if (errors.length > 0) {
                message.error("Заполните все поля адреса сервера")
                return
            }


            if (!data) {
                createServer({
                    data: newServer,
                    afterCreate: (id) => {
                        navigate(`/references/servers/${id}`)
                        doCheckConnection()
                    }
                })
            } else {
                updateServer({
                    data: newServer,
                    afterUpdate: () => {
                        doCheckConnection()
                    }
                });
            }
            // handleClose()
        },
        async () => {
            if (!newServer?.serverUrls || newServer?.serverUrls.length === 0) {
                message.error("Укажите адрес сервера")
                return
            }
            const errors = newServer?.serverUrls.filter(item => !item.port || item.port === "" || item.url === "http://" || item.url === "https://")
            if (errors.length > 0) {
                message.error("Заполните все поля адреса сервера")
                return
            }

        }
    )


    const handleClose = useCallback((data
    ) => {
        setNewServer(null);
        setValidated(false);
        onClose()
    }, [])


    return (
        <Drawer
            placement={"right"}
            open={open}
            width={500}
            closable={false}
            bodyStyle={{paddingBottom: 20, paddingTop: 100}}
        >
            <CForm validated={validated}
                   onSubmit={handleSubmit}
                   noValidate>
                <h6 style={{margin: '-8px 0px 0px 0px'}}>
                    {!data ? 'Новый сервер' : 'Редактирование сервера'}
                </h6>
                <div style={{float: "right", margin: "-28px 0px 0px 0px"}}>
                    <CTooltip content={"Закрыть"}
                    >
                        <Button
                            style={{float: 'right', width: '31px', height: '31px', margin: '0px 0px 0px 10px'}}
                            icon={<CloseOutlined/>}
                            onClick={() => handleClose()}
                        />
                    </CTooltip>

                    <CButton color={"primary"}
                             size={"sm"}
                             type={"submit"}
                             style={{display: 'inline-block'}}
                    >
                        Сохранить
                    </CButton>

                </div>
                <hr style={{margin: "15px 0px 15px 0px"}}/>

                {data && <div style={{width: '100%', margin: "5px 0px 65px 0px"}}>
                    <CButton type={"submit"} size={"sm"} color={"light"}
                             loading={checkConnectionInProgress}
                             disabled={checkConnectionInProgress}
                             style={{margin: '0px 0px 10px 0px', float: 'left'}}> Проверить доступность</CButton>
                    {/*<span>Статус:</span>*/}
                    {checkConnectionInProgress ?
                        <Spin style={{margin: '5px 20px 10px 20px', float: 'right'}}/> :
                        // accessInfo?.status === "NONE"  ? <Tag color="warning">Кластер не подключен</Tag> :
                        <CFormLabel style={{margin: '3px 0 10px 0', float: 'right'}}> {
                            connectionStatus === "OK" ?
                                <Tag color="success">Доступен</Tag> : (connectionStatus === "ERR") ?
                                    <Tag color="error">Недоступен</Tag> : ""}
                        </CFormLabel>
                    }

                </div>}

                <CFormInput
                    className={"mb-3"}
                    label={"Наименование"}
                    required
                    value={newServer ? newServer.name : ""}
                    onChange={(e) =>
                        setNewServer({
                            ...newServer,
                            name: e.target.value,
                        })
                    }
                />

                <CCol className={"mb-3"}>
                    <CFormSelect
                        label={"Тип сервера"}
                        value={newServer ? newServer.serverTypeId : ""}
                        required
                        onChange={(e) => {
                            setNewServer({
                                ...newServer,
                                serverTypeId: e.target.value,
                            })
                        }}
                    >
                        <option value={""} disabled selected hidden>
                            Выберите значение
                        </option>
                        {serverTypes && serverTypes.length > 0 && serverTypes?.map((el) => (
                            <option value={el?.id} key={el?.id}>
                                {el?.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>


                <CFormLabel style={{margin: '0px 0 10px 0'}}>
                    Адрес сервера
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <ServerUrlsTable data={newServer}
                                     type={"server"}
                                     maxNum={1}
                                     updateDataCallback={(data, address) => {
                                         setNewServer({
                                             ...newServer,
                                             serverUrls: data,
                                             // addressRegExp: "",
                                             // isRegExp: false,
                                         })

                                     }}/>
                </CCol>

                <CFormTextarea
                    className={"mb-3"}
                    label={"Комментарий"}
                    value={newServer ? newServer.comment : ""}
                    onChange={(e) =>
                        setNewServer({
                            ...newServer,
                            comment: e.target.value,
                        })
                    }
                />

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateServer;
