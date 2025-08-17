import {CButton, CCol, CForm, CFormInput, CFormLabel, CFormTextarea, CTooltip,} from "@coreui/react";
import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Checkbox, Drawer, Select, Spin} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useCreateSettingTraffic} from "../../../hooks/setting/traffic/useCreateSettingTraffic";
import {useUpdateSettingTraffic} from "../../../hooks/setting/traffic/useUpdateSettingTraffic";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import moment from "moment/moment";
import {useRecordTypes} from "../../../hooks/reference/recordType/useRecordTypes";
import {ReactComponent as ErrorIcon} from "../../../assets/brand/error_icon.svg"
import {useBuckets} from "../../../hooks/reference/cluster/useBuckets";


const CreateOrUpdateTrafficRule = memo(({
                                            open,
                                            data,
                                            onClose
                                        }) => {

    const [newSetting, setNewSetting] = useState();
    const [errors, setErrors] = useState(false);
    const [clusterOptions, setClusterOptions] = useState([]);
    const [methodOptions, setMethodOptions] = useState([]);
    const [searchClusterByName, setSearchClusterByName] = useState("");
    const [searchBucketByName, setSearchBucketByName] = useState("");
    const [bucketsOptions, setBucketsOptions] = useState([]);
    const {data: clusters, status: clusterStatus, isFetched: clusterIsFetched} = useClusters(searchClusterByName);
    const createCluster = useCreateSettingTraffic();
    const updateCluster = useUpdateSettingTraffic();
    const [records, recordsStatus] = useRecordTypes()
    const {
        data: buckets,
        status: bucketsStatus,
        isFetched: bucketsIsFetched
    } = useBuckets(newSetting?.clusterId, searchBucketByName);

    useEffect(() => {
        if (data) {
            setNewSetting(data)
        } else {
            setNewSetting({
                ...newSetting,
                recordTypes: []
            })
        }
    }, [data]);

    useEffect(() => {
        if (recordsStatus !== "loading") {
            if (records && Array.isArray(records)) {
                const opts = records?.map((el) => {
                    return {value: el?.id, label: el?.name}
                })
                const result = [{value: "Выбрать все", label: "Выбрать все"}]
                setMethodOptions([...result, ...opts])
            }
        }
    }, [records, recordsStatus])

    useEffect(() => {
        if (clusterIsFetched && clusters) {
            if (clusters?.length > 0) {
                const opts = clusters?.map((el) => {
                    return {value: el?.id, label: el?.name}
                })
                // if (clusters?.length > 9) {
                //     const result = [{value: "Выбрать все", label: "Выбрать все"}]
                //     setMethodOptions([...result, ...opts])
                // }
                setClusterOptions(opts)
            } else {
                setClusterOptions([])
            }

        }
    }, [clusters, clusterIsFetched])


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {
            if (!newSetting?.clusterId) {
                setErrors(true)
                return
            }
            if (!data) {
                createCluster({
                    data: newSetting,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateCluster({
                    data: newSetting,
                    afterUpdate: () => {

                    }
                });
            }

            handleClose();
        }, async () => {
            if (!newSetting?.clusterId) {
                setErrors(true)
                return
            }
        }
    )

    useEffect(() => {
        if (bucketsIsFetched && buckets) {
            if (buckets?.length > 0) {
                const opts = buckets?.map((el) => {
                    return {value: el, label: el}
                })
                setBucketsOptions(opts)
            } else {
                setBucketsOptions([])
            }
        }
    }, [buckets, bucketsIsFetched])

    const handleClose = useCallback(() => {
        setNewSetting(null);
        setValidated(false);
        onClose()
    }, [])

    const showMethods = useMemo(() => {
        return <Select
            style={{width: '100%', margin: '10 0 10px 0'}}
            mode="multiple"
            options={methodOptions}
            allowClear
            value={newSetting && newSetting.recordTypes?.length > 0 ? newSetting.recordTypes?.map(item => item.recordTypeId) : "Выбрать все"}
            onChange={(e) => {
                let result
                if (e.length === 0) {
                    result = []
                } else if (e.length > 1 && e[0] === "Выбрать все") {
                    result = e?.filter(item => item !== "Выбрать все").map((item) => {
                        return {recordTypeId: item}
                    })
                } else if (e.length > 0 && e[e.length - 1] === "Выбрать все") {
                    result = []
                } else {
                    result = e?.map((item) => {
                        return {recordTypeId: item}
                    })
                }

                setNewSetting({
                    ...newSetting,
                    recordTypes: result
                })
            }}
        />
    }, [newSetting, methodOptions, records])

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
                    {!data ? 'Новое правило лимитов и квот' : 'Изменить правило лимитов и квот'}
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

                <div style={{float: 'right'}}>
                    <Checkbox
                        style={{margin: '-5px 0px 0px 0px', width: '25px'}}
                        value={newSetting?.status}
                        onClick={(e) => setNewSetting({
                            ...newSetting,
                            status: e.target.checked,
                        })}
                        checked={newSetting?.status}
                    />


                    <CFormLabel style={{margin: '0px 10px 0 0px 0'}}>
                        активно
                    </CFormLabel>
                </div>

                <CFormLabel>
                    Кластер
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <Select
                        suffixIcon={errors && !newSetting?.clusterId ? <ErrorIcon/> : <span/>}
                        style={{width: '100%'}}
                        value={newSetting ? newSetting.clusterId : ""}
                        showSearch
                        options={clusterOptions}
                        notFoundContent={clusterStatus === "loading" ?
                            <Spin size="small"/> : null}
                        virtual
                        autoClearSearchValue
                        allowClear
                        onSearch={(value) => setSearchClusterByName(value)}
                        filterOption={false}
                        onChange={(value, option) => {
                            setNewSetting({
                                ...newSetting,
                                clusterId: option?.value,
                            })
                        }}
                    />

                    {/*<CFormSelect*/}
                    {/*    sear*/}
                    {/*    label={"Кластер"}*/}
                    {/*    value={newSetting ? newSetting.clusterId : ""}*/}
                    {/*    required*/}
                    {/*    onChange={(e) => {*/}
                    {/*        setNewSetting({*/}
                    {/*            ...newSetting,*/}
                    {/*            clusterId: e.target.value,*/}
                    {/*        })*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <option value={""} disabled selected hidden>*/}
                    {/*        Выберите значение*/}
                    {/*    </option>*/}
                    {/*    {clusters && clusters.length > 0 && clusters?.map((el) => (*/}
                    {/*        <option value={el?.id} key={el?.id}>*/}
                    {/*            {el?.name}*/}
                    {/*        </option>*/}
                    {/*    ))}*/}
                    {/*</CFormSelect>*/}
                </CCol>

                <CFormLabel>
                    Бакет
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <Select
                        suffixIcon={errors && !newSetting?.bucket ? <ErrorIcon/> : <span/>}
                        style={{width: '100%'}}
                        value={newSetting ? newSetting.bucket : ""}
                        showSearch
                        options={bucketsOptions}
                        notFoundContent={bucketsStatus === "loading" ?
                            <Spin size="small"/> : null}
                        virtual
                        autoClearSearchValue
                        allowClear
                        onSearch={(value) => setSearchBucketByName(value)}
                        filterOption={false}
                        onChange={(value, option) => {
                            setNewSetting({
                                ...newSetting,
                                bucket: option?.value,
                            })
                        }}
                    />
                </CCol>


                <CCol className={"mb-3"}>
                    <CFormLabel>Метод S3</CFormLabel>
                    {showMethods}
                </CCol>

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


                <CFormInput
                    className={"mb-3"}
                    label={"Число запросов в сек."}
                    required={!newSetting?.throughput || newSetting?.throughput === ""}
                    value={newSetting ? newSetting.rps : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            rps: e.target.value,
                        })
                    }
                />

                <CFormInput
                    className={"mb-3"}
                    label={"Пропускная способность"}
                    required={!newSetting?.rps || newSetting?.rps === ""}
                    value={newSetting ? newSetting.throughput : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            throughput: e.target.value,
                        })
                    }
                />


                {/*<CFormInput*/}
                {/*    className={"mb-3"}*/}
                {/*    label={"Адрес точки доступа кластера"}*/}
                {/*    // type={"password"}*/}
                {/*    // required*/}
                {/*    value={newSetting ? newSetting.clusterUrl : ""}*/}
                {/*    onChange={(e) =>*/}
                {/*        setNewSetting({*/}
                {/*            ...newSetting,*/}
                {/*            clusterUrl: e.target.value,*/}
                {/*        })*/}
                {/*    }*/}
                {/*/>*/}

                <CFormInput
                    className={"mb-3"}
                    label={"Ключ доступа"}
                    // type={"password"}
                    // disabled={data}
                    // required
                    value={newSetting ? newSetting.accessKey : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            accessKey: e.target.value,
                        })
                    }
                />

                {/*<CFormInput*/}
                {/*    className={"mb-3"}*/}
                {/*    label={"Сессия"}*/}
                {/*    // required*/}
                {/*    value={newSetting ? newSetting.session : ""}*/}
                {/*    onChange={(e) =>*/}
                {/*        setNewSetting({*/}
                {/*            ...newSetting,*/}
                {/*            session: e.target.value,*/}
                {/*        })*/}
                {/*    }*/}
                {/*/>*/}


                <CFormInput
                    className={"mb-3"}
                    label={"Исходный IP"}
                    // required
                    value={newSetting ? newSetting.ipOriginal : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            ipOriginal: e.target.value,
                        })
                    }
                />

                <CFormTextarea
                    className={"mb-3"}
                    label={"Комментарий"}
                    // required
                    value={newSetting ? newSetting.ruleName : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            ruleName: e.target.value,
                        })
                    }
                />


                {data && <CFormInput
                    className={"small"}
                    label={"Последнее изменение"}
                    // type={"password"}
                    disabled
                    required
                    value={newSetting ? moment(newSetting.changeDate).format("YYYY-MM-DD HH:mm:ss") : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            changeDate: e.target.value,
                        })
                    }
                />}

            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateTrafficRule;
