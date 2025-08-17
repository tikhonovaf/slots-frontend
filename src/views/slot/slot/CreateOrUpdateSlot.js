import {CButton, CCol, CForm, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useCallback, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Checkbox, Drawer, message, Spin, Tag} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useVendors} from "../../../hooks/reference/vendor/useVendors";
import {useUpdateCluster} from "../../../hooks/reference/cluster/useUpdateCluster";
import {useCreateCluster} from "../../../hooks/reference/cluster/useCreateCluster";
import {useUsers} from "../../../hooks/reference/user/useUsers";
import {ServerUrlsTable} from "../../../components/ServerUrlsTable";

import {useClusterCheckAccessability} from "../../../hooks/reference/cluster/useClusterCheckAccessability";
import {useNavigate} from "react-router";


const CreateOrUpdateSlot = memo(({
                                        open,
                                        data,
                                        onClose
                                    }) => {

    const navigate = useNavigate();
    const [newCluster, setNewCluster] = useState();
    const createCluster = useCreateCluster();
    const updateCluster = useUpdateCluster();
    const [vendors, vendorsStatus] = useVendors();
    const [users, usersStatus] = useUsers();
    const [isRegExp, setIsRegExp] = useState(true)

    const {
        data: accessInfo,
        status: accessInfoStatus,
        refetch: refetchAccessStatus
    } = useClusterCheckAccessability(newCluster?.id)


    useEffect(() => {
        if (data) {
            setNewCluster(data)
            setIsRegExp((data?.clusterUrls && data?.clusterUrls.length > 0
                    && (data?.clusterUrls[0].isRegExp || (data?.clusterUrls[0].addressRegExp !== "" && data?.clusterUrls[0].addressRegExp !== null)))
                || data?.clusterUrls.length === 0)
        } else {
            setNewCluster({});
        }
    }, [data]);


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {
            if (!newCluster?.clusterUrls || newCluster?.clusterUrls.length === 0) {
                message.error("Укажите адрес кластера")
                return
            }
            if (!isRegExp) {
                const errors = newCluster?.clusterUrls.filter(item => !item.port || item.port === "" || item.url === "http://" || item.url === "https://")
                if (errors.length > 0) {
                    message.error("Заполните все поля адреса кластера")
                    return
                }
            }

            if (!data) {
                createCluster({
                    data: newCluster,
                    afterCreate: (id) => {
                        navigate(`/references/clusters/${id}`)
                    }
                })
            } else {
                updateCluster({
                    data: newCluster,
                    afterUpdate: () => {
                        refetchAccessStatus()
                    }
                });
            }


        },
        async () => {
            if (!newCluster?.clusterUrls || newCluster?.clusterUrls.length === 0) {
                message.error("Укажите адрес кластера")
                return
            }
            if (!isRegExp) {
                const errors = newCluster?.clusterUrls.filter(item => !item.port || item.port === "" || item.url === "http://" || item.url === "https://")
                if (errors.length > 0) {
                    message.error("Заполните все поля адреса кластера")
                    return
                }
            }
        }
    )

    const handleCheck = useCallback((e
    ) => {
        setIsRegExp(e.target.checked)
        if (!e.target.checked && (!newCluster?.clusterUrls || newCluster?.clusterUrls && newCluster?.clusterUrls?.length === 0)) {
            setNewCluster({
                ...newCluster,
                clusterUrls: [{
                    // ...newCluster?.clusterUrls[0],
                    addressRegExp: "",
                    isRegExp: false,
                    url: "",
                    port: ''
                }]
            })
        }
        if (e.target.checked) {
            setNewCluster({
                ...newCluster,
                clusterUrls: [{
                    ...newCluster?.clusterUrls[0],
                    // addressRegExp: "",
                    isRegExp: true,
                    url: "",
                    port: ''
                }]
            })
        }
    }, [newCluster])


    const handleClose = useCallback((data
    ) => {
        setIsRegExp(true)
        setNewCluster(null);
        setValidated(false);
        onClose()
    }, [])


    return (
        <Drawer
            placement={"right"}
            open={open}
            width={560}
            closable={false}
            bodyStyle={{paddingBottom: 20, paddingTop: 100}}
        >
            <CForm validated={validated}
                   onSubmit={handleSubmit}
                   noValidate>
                <h6 style={{margin: '-8px 0px 0px 0px'}}>
                    {!data ? 'Новый кластер' : 'Редактирование кластера'}
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
                             disabled={accessInfoStatus === "loading"}
                             style={{margin: '0px 0px 10px 0px', float: 'left'}}> Проверить доступность</CButton>
                    {/*<span>Статус:</span>*/}
                    {accessInfoStatus === "loading" ?
                        <Spin style={{margin: '10px 20px 10px 20px', float: 'right'}}/> :
                        // accessInfo?.status === "NONE"  ? <Tag color="warning">Кластер не подключен</Tag> :
                        <CFormLabel style={{margin: '4px 0 10px 0', float: 'right'}}> {
                            accessInfo?.status === "ALL" ? <Tag color="success">Кластер подключен
                                успешно</Tag> : (accessInfoStatus === "error" || accessInfo?.status === "NONE") ?
                                <Tag color="error">Кластер недоступен</Tag> : accessInfo?.status === "SOME" ?
                                    <Tag color="warning">Кластер доступен частично</Tag> : ""}
                        </CFormLabel>
                    }
                </div>}

                <CFormInput

                    className={"mb-3"}
                    label={"Наименование"}
                    required
                    value={newCluster ? newCluster.name : ""}
                    onChange={(e) =>
                        setNewCluster({
                            ...newCluster,
                            name: e.target.value,
                        })
                    }
                />

                <CCol className={"mb-3"} style={{width: '100%'}}>


                    <CFormSelect
                        label={"Тип кластера"}
                        value={newCluster ? newCluster.vendorId : ""}
                        required
                        onChange={(e) => {
                            setNewCluster({
                                ...newCluster,
                                vendorId: e.target.value,
                            })
                        }}
                    >
                        <option value={""} disabled selected hidden>
                            Выберите значение
                        </option>
                        {vendors && vendors.length > 0 && vendors?.map((el) => (
                            <option value={el?.id} key={el?.id}>
                                {el?.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>

                {/*<CFormInput*/}
                {/*    className={"mb-3"}*/}
                {/*    label={"Ключ доступа"}*/}
                {/*    // required*/}
                {/*    // type={"password"}*/}
                {/*    // disabled={data}*/}
                {/*    value={newCluster ? newCluster.accessKey : ""}*/}
                {/*    onChange={(e) =>*/}
                {/*        setNewCluster({*/}
                {/*            ...newCluster,*/}
                {/*            accessKey: e.target.value,*/}
                {/*        })*/}
                {/*    }*/}
                {/*/>*/}

                {/*<CFormInput*/}
                {/*    className={"mb-3"}*/}
                {/*    label={"Ключ секрета"}*/}
                {/*    // required*/}
                {/*    // type={"password"}*/}
                {/*    // disabled={data}*/}
                {/*    value={newCluster ? newCluster.secretKey : ""}*/}
                {/*    onChange={(e) =>*/}
                {/*        setNewCluster({*/}
                {/*            ...newCluster,*/}
                {/*            secretKey: e.target.value,*/}
                {/*        })*/}
                {/*    }*/}
                {/*/>*/}

                <CCol className={"mb-3"}>
                    <CFormSelect
                        label={"Пользователь"}
                        value={newCluster ? newCluster.userId : ""}
                        required
                        onChange={(e) => {
                            setNewCluster({
                                ...newCluster,
                                userId: e.target.value,
                            })
                        }}
                    >
                        <option value={""} disabled selected hidden>
                            Выберите значение
                        </option>
                        {users && users.length > 0 && users?.map((el) => (
                            <option value={el?.id} key={el?.id}>
                                {el?.lastName}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>
                <CFormTextarea
                    className={"mb-3"}
                    label={"Комментарий"}
                    value={newCluster ? newCluster.comment : ""}
                    onChange={(e) =>
                        setNewCluster({
                            ...newCluster,
                            comment: e.target.value,
                        })
                    }
                />

                <CFormLabel style={{margin: '0px 0 10px 0'}}>
                    Адрес точек доступа кластера
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <Checkbox
                        style={{margin: '0px 0px 0px 0px', width: '30px'}}
                        value={isRegExp}
                        onClick={(e) => handleCheck(e)}
                        checked={isRegExp}
                    />


                    <CFormLabel style={{margin: '7px 0 15px 0'}}>
                        регулярное выражение
                    </CFormLabel>


                    {isRegExp && <CFormInput
                        className={"mb-3"}
                        style={{margin: '0px 0 0px 0'}}
                        required
                        value={newCluster?.clusterUrls ? newCluster.clusterUrls[0]?.addressRegExp : ""}
                        onChange={(e) => {
                            if (newCluster?.clusterUrls) {
                                setNewCluster({
                                    ...newCluster,
                                    clusterUrls: [{
                                        ...newCluster?.clusterUrls[0],
                                        addressRegExp: e.target.value,
                                        isRegExp: true
                                    }],
                                })
                            } else {
                                setNewCluster({
                                    ...newCluster,
                                    clusterUrls: [{
                                        addressRegExp: e.target.value,
                                        isRegExp: true
                                    }],
                                })
                            }
                        }}
                    />}


                    {!isRegExp && <ServerUrlsTable data={newCluster}
                                                   connectionData={accessInfo}
                                                   type={"cluster"}
                                                   maxNum={100}
                                                   checkConnectionStatus={accessInfoStatus}
                                                   updateDataCallback={(data) => {
                                                       setNewCluster({
                                                           ...newCluster,
                                                           clusterUrls: data,
                                                       })
                                                   }}/>}
                </CCol>

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateSlot;
