import {CButton, CCol, CForm, CFormInput, CFormLabel, CTooltip,} from "@coreui/react";
import React, {memo, useEffect, useState} from "react";
import useImprovedForm from "../../../hooks/useImprovedForm";
import {Button, Checkbox, Drawer, Select, Spin} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useCreateSettingSynch} from "../../../hooks/setting/synch/useCreateSettingSynch";
import {useUpdateSettingSynch} from "../../../hooks/setting/synch/useUpdateSettingSynch";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import {useBuckets} from "../../../hooks/reference/cluster/useBuckets";
import {ReactComponent as ErrorIcon} from "../../../assets/brand/error_icon.svg"


const CreateOrUpdateCloneRule = memo(({
                                          open,
                                          data,
                                          onClose
                                      }) => {

    const [newSetting, setNewSetting] = useState();
    const [errors, setErrors] = useState(false);
    const createSetting = useCreateSettingSynch();
    const updateSetting = useUpdateSettingSynch();

    const [clusterSourceOptions, setClusterSourceOptions] = useState([]);
    const [clusterTargetOptions, setClusterTargetOptions] = useState([]);
    const [bucketsIncludeOptions, setBucketsIncludeOptions] = useState([]);
    const [bucketsExcludeOptions, setBucketsExcludeOptions] = useState([]);
    const [searchClusterSourceByName, setSearchClusterSourceByName] = useState("");
    const [searchClusterTargetByName, setSearchClusterTargetByName] = useState("");
    const [searchBucketIncludeByName, setSearchBucketIncludeByName] = useState("");
    const [searchBucketExcludeByName, setSearchBucketExcludeByName] = useState("");

    const {
        data: clustersSource,
        status: clusterSourceStatus,
        isFetched: clusterSourceIsFetched
    } = useClusters(searchClusterSourceByName);
    const {
        data: clustersTarget,
        status: clusterTargetStatus,
        isFetched: clusterTargetIsFetched
    } = useClusters(searchClusterTargetByName);


    const {
        data: bucketsInclude,
        status: bucketsIncludeStatus,
        isFetched: bucketsIncludeIsFetched
    } = useBuckets(newSetting?.clusterSourceId, searchBucketIncludeByName);

    const {
        data: bucketsExclude,
        status: bucketsExcludeStatus,
        isFetched: bucketsExcludeIsFetched
    } = useBuckets(newSetting?.clusterSourceId, searchBucketExcludeByName);

    useEffect(() => {
        if (data) {
            setNewSetting(data)
        } else {
            setNewSetting(null);
        }
    }, [data]);

    useEffect(() => {
        if (clusterSourceIsFetched && clustersSource) {
            if (clustersSource?.length > 0) {
                const opts = clustersSource?.filter(item => newSetting?.clusterTargetId !== item.id)
                    .map((el) => {
                        return {value: el?.id, label: el?.name}
                    })
                setClusterSourceOptions(opts)
            } else {
                setClusterSourceOptions([])
            }
        }
    }, [clustersSource, clusterSourceIsFetched, newSetting?.clusterTargetId])

    useEffect(() => {
        if (clusterTargetIsFetched && clustersTarget) {
            if (clustersTarget?.length > 0) {
                const opts = clustersTarget?.filter(item => newSetting?.clusterSourceId !== item.id)
                    .map((el) => {
                        return {value: el?.id, label: el?.name}
                    })
                setClusterTargetOptions(opts)
            } else {
                setClusterTargetOptions([])
            }
        }
    }, [clustersTarget, clusterTargetIsFetched, newSetting?.clusterSourceId])


    useEffect(() => {
        if (bucketsIncludeIsFetched && bucketsInclude) {
            if (bucketsInclude?.length > 0) {
                const opts = bucketsInclude?.filter(item => !newSetting?.exceptBuckets?.map(item => item.bucket)?.includes(item))
                    .map((el) => {
                        return {value: el, label: el}
                    })
                setBucketsIncludeOptions(opts)
            } else {
                setBucketsIncludeOptions([])
            }
        }
    }, [bucketsInclude, bucketsIncludeIsFetched, newSetting?.exceptBuckets])

    useEffect(() => {
        if (bucketsExcludeIsFetched && bucketsExclude) {
            if (bucketsExclude?.length > 0) {
                const opts = bucketsExclude?.filter(item => !newSetting?.onlyBuckets?.map(item => item.bucket)?.includes(item))
                    .map((el) => {
                        return {value: el, label: el}
                    })
                setBucketsExcludeOptions(opts)
            } else {
                setBucketsExcludeOptions([])
            }
        }
    }, [bucketsExclude, bucketsExcludeIsFetched, newSetting?.onlyBuckets])


    const {validated, setValidated, handleSubmit} = useImprovedForm(
        async () => {
            if (!newSetting?.clusterSourceId || !newSetting?.clusterTargetId || !newSetting?.onlyBuckets) {
                setErrors(true)
                return
            }
            if (!data) {
                createSetting({
                    data: newSetting,
                    afterCreate: (id) => {

                    }
                })
            } else {
                updateSetting({
                    data: newSetting,
                    afterUpdate: () => {

                    }
                });
            }
            setNewSetting(null);
            setValidated(false);
            onClose();
        }, async () => {
            if (!newSetting?.clusterSourceId || !newSetting?.clusterTargetId || !newSetting?.onlyBuckets) {
                setErrors(true)
                return
            }
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
                    {!data ? 'Новое правило копирования' : 'Изменить правило копирования'}
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
                    label={"Наименование"}
                    required
                    value={newSetting ? newSetting.ruleName : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            ruleName: e.target.value,
                        })
                    }
                />

                <CFormLabel>
                    Кластер источник
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <Select
                        suffixIcon={errors && !newSetting?.clusterSourceId ? <ErrorIcon/> : <span/>}
                        style={{width: '100%'}}
                        value={newSetting ? newSetting.clusterSourceId : ""}
                        showSearch
                        options={clusterSourceOptions}
                        // notFoundContent={clusterStatus === "loading" ?
                        //     <Spin size="small"/> : null}
                        virtual
                        autoClearSearchValue
                        allowClear
                        onSearch={(value) => setSearchClusterSourceByName(value)}
                        filterOption={false}
                        onChange={(value, option) => {
                            setNewSetting({
                                ...newSetting,
                                clusterSourceId: option?.value,
                            })
                        }}
                    />
                </CCol>

                <CFormLabel>
                    Кластер приемник
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <Select
                        suffixIcon={errors && !newSetting?.clusterTargetId ? <ErrorIcon/> : <span/>}
                        style={{width: '100%'}}
                        value={newSetting ? newSetting.clusterTargetId : ""}
                        showSearch
                        options={clusterTargetOptions}
                        // notFoundContent={clusterStatus === "loading" ?
                        //     <Spin size="small"/> : null}
                        virtual
                        autoClearSearchValue
                        allowClear

                        onSearch={(value) => setSearchClusterTargetByName(value)}
                        filterOption={false}
                        onChange={(value, option) => {
                            setNewSetting({
                                ...newSetting,
                                clusterTargetId: option?.value,
                            })
                        }}
                    />
                </CCol>


                <CFormLabel>
                    Бакеты для копирования
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <Select
                        suffixIcon={errors && !newSetting?.onlyBuckets ? <ErrorIcon/> : <span/>}
                        style={{width: '100%'}}
                        value={newSetting ? newSetting.onlyBuckets?.map(item => item?.bucket) : []}
                        showSearch
                        options={bucketsIncludeOptions}
                        notFoundContent={bucketsIncludeStatus === "loading" ?
                            <Spin size="small"/> : null}
                        virtual
                        mode="multiple"
                        autoClearSearchValue
                        allowClear
                        onSearch={(value) => setSearchBucketIncludeByName(value)}
                        filterOption={false}
                        onChange={(e) => {
                            setNewSetting({
                                ...newSetting,
                                onlyBuckets: e?.map((item) => {
                                    return {bucket: item}
                                }),
                            })
                        }}
                    />
                </CCol>

                <CFormLabel>
                    Бакеты для исключения
                </CFormLabel>

                <CCol className={"mb-3"}>
                    <Select
                        // suffixIcon={errors && !newSetting?.exceptBuckets ? <ErrorIcon/> : <span/>}
                        style={{width: '100%'}}
                        value={newSetting ? newSetting.exceptBuckets?.map(item => item?.bucket) : []}
                        showSearch
                        options={bucketsExcludeOptions}
                        notFoundContent={bucketsExcludeStatus === "loading" ?
                            <Spin size="small"/> : null}
                        virtual
                        mode="multiple"
                        autoClearSearchValue
                        allowClear
                        onSearch={(value) => setSearchBucketExcludeByName(value)}
                        filterOption={false}
                        onChange={(e) => {
                            setNewSetting({
                                ...newSetting,
                                exceptBuckets: e?.map((item) => {
                                    return {bucket: item}
                                }),
                            })
                        }}
                    />
                </CCol>
                <CFormInput
                    className={"mb-3"}
                    label={"Добавленный суффикс"}
                    // required
                    value={newSetting ? newSetting.bucketAddsuffix : ""}
                    onChange={(e) =>
                        setNewSetting({
                            ...newSetting,
                            bucketAddsuffix: e.target.value,
                        })
                    }
                />
                <div>
                    <Checkbox
                        style={{margin: '15px 0px 0px 0px', width: '25px'}}
                        value={newSetting?.switchRoute}
                        onClick={(e) => setNewSetting({
                            ...newSetting,
                            switchRoute: e.target.checked,
                        })}
                        checked={newSetting?.switchRoute}
                    />
                    <CFormLabel>
                        Переключить маршрут на новый кластер
                    </CFormLabel>
                </div>

                <div>
                    <Checkbox
                        style={{margin: '15px 0px 0px 0px', width: '25px'}}
                        value={newSetting?.deleteSrcBuckets}
                        onClick={(e) => setNewSetting({
                            ...newSetting,
                            deleteSrcBuckets: e.target.checked,
                        })}
                        checked={newSetting?.deleteSrcBuckets}
                    />
                    <CFormLabel>
                        Удалить исходный бакет
                    </CFormLabel>
                </div>


            </CForm>
        </Drawer>
    );
})


export default CreateOrUpdateCloneRule;
