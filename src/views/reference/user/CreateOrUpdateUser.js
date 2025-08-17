import {CButton, CCol, CForm, CFormInput, CFormSelect, CTooltip,} from "@coreui/react";
import React, {memo, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Drawer} from "antd";
import {CloseOutlined} from "@ant-design/icons";

import {useCreateUser} from "../../../hooks/reference/user/useCreateUser";
import {useUpdateUser} from "../../../hooks/reference/user/useUpdateUser";
import {useRoles} from "../../../hooks/reference/role/useRoles";
import {useDepartments} from "../../../hooks/reference/department/useDepartments";


const CreateOrUpdateUser = memo(({
                                     open,
                                     data,
                                     onClose
                                 }) => {

    const [newUser, setNewUser] = useState();
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const [roles, rolesStatus] = useRoles();
    const [departments, departmentsStatus] = useDepartments();

    useEffect(() => {
        if (data) {
            setNewUser(data)
        } else {
            setNewUser(null);
        }
    }, [data]);


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {

            if (!data) {
                createUser({
                    data: newUser,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateUser({
                    data: newUser,
                    afterUpdate: () => {

                    }
                });
            }
            setNewUser(null);
            setValidated(false);
            onClose();
        }
    )


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
                    {!data ? 'Новый пользователь' : 'Изменить пользователя'}
                </h6>
                <div style={{float: "right", margin: "-28px 0px 0px 0px"}}>
                    <CTooltip content={"Закрыть"}
                    >
                        <Button
                            style={{float: 'right', width: '31px', height: '31px', margin: '0px 0px 0px 10px'}}
                            icon={<CloseOutlined/>}
                            onClick={() => onClose()}
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
                    label={"Имя"}
                    required
                    value={newUser ? newUser.firstName : ""}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            firstName: e.target.value,
                        })
                    }
                />
                <CFormInput
                    className={"mb-3"}
                    label={"Отчество"}
                    // required
                    value={newUser ? newUser.secondName : ""}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            secondName: e.target.value,
                        })
                    }
                />
                <CFormInput
                    className={"mb-3"}
                    label={"Фамилия"}
                    required
                    value={newUser ? newUser.lastName : ""}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            lastName: e.target.value,
                        })
                    }
                />

                <CFormInput
                    className={"mb-3"}
                    label={"Логин"}
                    required
                    value={newUser ? newUser.login : ""}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            login: e.target.value,
                        })
                    }
                />

                <CFormInput
                    className={"mb-3"}
                    label={"Ключ доступа"}
                    required
                    // type={"password"}
                    // disabled={data}
                    value={newUser ? newUser.accessKey : ""}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            accessKey: e.target.value,
                        })
                    }
                />

                {/*{!data && <CCol className={"mb-3"}>*/}
                {/*    <CFormLabel>*/}
                {/*        Дата окончания ключа доступа*/}
                {/*    </CFormLabel>*/}
                {/*    <ConfigProvider locale={locale}>*/}
                {/*        <DatePicker*/}
                {/*            className={"w-100"}*/}
                {/*            value={newUser ? newUser.accessKeyExpireDate : ""}*/}
                {/*            onChange={(date) => {*/}
                {/*                setNewUser({*/}
                {/*                    ...newUser,*/}
                {/*                    accessKeyExpireDate: date,*/}
                {/*                });*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </ConfigProvider>*/}
                {/*</CCol>}*/}


                <CFormInput
                    className={"mb-3"}
                    label={"Secret Key"}
                    required
                    type={"password"}
                    disabled={data}
                    value={newUser ? newUser.secretKey : ""}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            secretKey: e.target.value,
                        })
                    }
                />
                <CCol className={"mb-3"}>
                    <CFormSelect
                        label={"Роль"}
                        value={newUser ? newUser.roleId : ""}
                        required
                        onChange={(e) => {
                            setNewUser({
                                ...newUser,
                                roleId: e.target.value,
                            })
                        }}
                    >
                        <option value={""} disabled selected hidden>
                            Выберите значение
                        </option>
                        {roles && roles.length > 0 && roles?.map((el) => (
                            <option value={el?.id} key={el?.id}>
                                {el?.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>


                <CFormInput
                    className={"mb-3"}
                    label={"E-mail"}
                    required
                    value={newUser ? newUser.email : ""}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            email: e.target.value,
                        })
                    }
                />
                {/*<CFormInput*/}
                {/*    className={"mb-3"}*/}
                {/*    label={"Телефон"}*/}
                {/*    // required*/}
                {/*    value={newUser ? newUser.phone : ""}*/}
                {/*    onChange={(e) =>*/}
                {/*        setNewUser({*/}
                {/*            ...newUser,*/}
                {/*            phone: e.target.value,*/}
                {/*        })*/}
                {/*    }*/}
                {/*/>*/}
                {/*<CFormInput*/}
                {/*    className={"mb-3"}*/}
                {/*    label={"Телеграм"}*/}
                {/*    // required*/}
                {/*    value={newUser ? newUser.telegram : ""}*/}
                {/*    onChange={(e) =>*/}
                {/*        setNewUser({*/}
                {/*            ...newUser,*/}
                {/*            telegram: e.target.value,*/}
                {/*        })*/}
                {/*    }*/}
                {/*/>*/}
                <CFormInput
                    className={"mb-3"}
                    label={"Сервис"}
                    // required
                    value={newUser ? newUser.serviceName : ""}
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            serviceName: e.target.value,
                        })
                    }
                />


                {/*<CFormInput*/}
                {/*    className={"mb-3"}*/}
                {/*    label={"Активность"}*/}
                {/*    required*/}
                {/*    value={newUser ? newUser.activity : ""}*/}
                {/*    onChange={(e) =>*/}
                {/*        setNewUser({*/}
                {/*            ...newUser,*/}
                {/*            activity: e.target.value,*/}
                {/*        })*/}
                {/*    }*/}
                {/*/>*/}


                <CCol className={"mb-3"}>
                    <CFormSelect
                        label={"Отдел"}
                        value={newUser ? newUser.departmentId : ""}
                        // required
                        onChange={(e) => {
                            setNewUser({
                                ...newUser,
                                departmentId: e.target.value,
                            })
                        }}
                    >
                        <option value={""} disabled selected hidden>
                            Выберите значение
                        </option>
                        {departments && departments.length > 0 && departments?.map((el) => (
                            <option value={el?.id} key={el?.id}>
                                {el?.name}
                            </option>
                        ))}
                    </CFormSelect>
                </CCol>

                {/*<CCol className={"mb-3"}>*/}
                {/*    <CFormLabel>*/}
                {/*        Дата начала*/}
                {/*    </CFormLabel>*/}
                {/*    <ConfigProvider locale={locale}>*/}
                {/*        <DatePicker*/}
                {/*            className={"w-100"}*/}
                {/*            value={newUser ? newUser.startDate : ""}*/}
                {/*            onChange={(date) => {*/}
                {/*                setNewUser({*/}
                {/*                    ...newUser,*/}
                {/*                    startDate: date,*/}
                {/*                });*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </ConfigProvider>*/}
                {/*</CCol>*/}
                {/*<CCol className={"mb-3"}>*/}
                {/*    <CFormLabel>*/}
                {/*        Дата окончания*/}
                {/*    </CFormLabel>*/}
                {/*    <ConfigProvider locale={locale}>*/}
                {/*        <DatePicker*/}
                {/*            className={"w-100"}*/}
                {/*            value={newUser ? newUser.endDate : ""}*/}
                {/*            onChange={(date) => {*/}
                {/*                setNewUser({*/}
                {/*                    ...newUser,*/}
                {/*                    endDate: date,*/}
                {/*                });*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </ConfigProvider>*/}
                {/*</CCol>*/}

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateUser;
