import {CButton, CForm, CFormInput, CTooltip,} from "@coreui/react";
import React, {memo, useCallback, useEffect, useState} from "react";

import {Button, Drawer} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import moment from "moment";

import {useCreateS3CloneSession} from "../../../hooks/s3clone/useCreateS3CloneSession";
import {useUpdateS3CloneSession} from "../../../hooks/s3clone/useUpdateS3CloneSession";
import useImprovedForm from "../../../hooks/useImprovedForm";


const CreateOrUpdateS3Session = memo(({
                                          open,
                                          data,
                                          onClose
                                      }) => {

    const [newSession, setNewSession] = useState();
    const [errors, setErrors] = useState(false);

    const createSession = useCreateS3CloneSession();
    const updateSession = useUpdateS3CloneSession();

    useEffect(() => {
        if (data) {
            setNewSession(data)
        } else {
            setNewSession({
                ...newSession,
                recordTypes: []
            })
        }
    }, [data]);


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {
            if (!newSession?.clusterId) {
                setErrors(true)
                return
            }

            if (!data) {
                createSession({
                    data: newSession,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateSession({
                    data: newSession,
                    afterUpdate: () => {

                    }
                });
            }

            handleClose();
        }, async () => {
            if (!newSession?.clusterId) {
                setErrors(true)
                return
            }
        }
    )

    const handleClose = useCallback(() => {
        setNewSession(null);
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
                    {!data ? 'Новая сессия копирования' : 'Изменить сессию копирования'}
                </h6>
                <div style={{float: "right", margin: "-28px 0px 0px 0px"}}>
                    <CTooltip content={"Закрыть"}
                    >
                        <Button
                            style={{float: 'right', width: '31px', height: '31px', margin: '0px 0px 0px 10px'}}
                            icon={<CloseOutlined/>}
                            onClick={handleClose}
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

                <CFormInput
                    className={"mb-3"}
                    label={"Наименование"}
                    // required
                    value={newSession ? newSession.name : ""}
                    onChange={(e) =>
                        setNewSession({
                            ...newSession,
                            name: e.target.value,
                        })
                    }
                />

                <CFormInput
                    className={"mb-3"}
                    label={"Статус"}
                    // type={"password"}
                    // disabled={data}
                    // required
                    value={newSession ? newSession.state : ""}
                    onChange={(e) =>
                        setNewSession({
                            ...newSession,
                            state: e.target.value,
                        })
                    }
                />
                {/*<CCol className={"mb-3"}>*/}
                {/*    <CFormSelect*/}
                {/*        label={"Пользователь"}*/}
                {/*        value={newSetting ? newSetting.userId : ""}*/}
                {/*        // required*/}
                {/*        onChange={(e) => {*/}
                {/*            setNewSetting({*/}
                {/*                ...newSetting,*/}
                {/*                userId: e.target.value,*/}
                {/*            })*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <option value={""} disabled selected hidden>*/}
                {/*            Выберите значение*/}
                {/*        </option>*/}
                {/*        {users && users.length > 0 && users?.map((el) => (*/}
                {/*            <option value={el?.id} key={el?.id}>*/}
                {/*                {el?.lastName}*/}
                {/*            </option>*/}
                {/*        ))}*/}
                {/*    </CFormSelect>*/}
                {/*</CCol>*/}

                {data && <CFormInput
                    // className={"small"}
                    label={"Дата создания"}
                    style={{margin: '0px 0 15px 0'}}
                    // type={"password"}
                    disabled
                    required
                    value={newSession ? moment(newSession.created).format("YYYY-MM-DD HH:mm:ss") : ""}
                    onChange={(e) =>
                        setNewSession({
                            ...newSession,
                            created: e.target.value,
                        })
                    }
                />}

                {data && <CFormInput
                    // className={"small"}
                    label={"Дата изменения"}

                    // type={"password"}
                    disabled
                    required
                    value={newSession ? moment(newSession.updated).format("YYYY-MM-DD HH:mm:ss") : ""}
                    onChange={(e) =>
                        setNewSession({
                            ...newSession,
                            updated: e.target.value,
                        })
                    }
                />}


                {/*<CCol className={"mb-3"}>*/}
                {/*    <CFormLabel>*/}
                {/*       Последнее изменение записи*/}
                {/*    </CFormLabel>*/}
                {/*    <ConfigProvider locale={locale}>*/}
                {/*        <DatePicker*/}
                {/*            className={"w-100"}*/}
                {/*            time*/}
                {/*            value={newSetting ? newSetting.changeDate : ""}*/}
                {/*            onChange={(date) => {*/}
                {/*                setNewSetting({*/}
                {/*                    ...newSetting,*/}
                {/*                    changeDate: date,*/}
                {/*                });*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </ConfigProvider>*/}
                {/*</CCol>*/}


            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateS3Session;
