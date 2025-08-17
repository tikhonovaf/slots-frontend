import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useModals} from "../../../hooks/useModals";
import {Button, Input, message, Space, Table, TableProps, Tooltip} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {DeleteModal} from "../../../components/DeleteModal";
import {TableLocale} from "antd/es/table/interface";
import {Link} from "react-router-dom";
import CIcon from "@coreui/icons-react";
import CreateOrUpdateCloneRule from "./CreateOrUpdateCloneRule";
import {useSettingsSynch} from "../../../hooks/setting/synch/useSettingsSynch";
import {useSettingSynch} from "../../../hooks/setting/synch/useSettingSynch";
import {useDeleteSettingSynch} from "../../../hooks/setting/synch/useDeleteSettingSynch";
import type {ClusterModel} from "../../../models/reference/cluster.model";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import {cilBrushAlt, cilMediaPlay, cilMediaStepForward, cilPlus, cilTrash} from "@coreui/icons";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";
import {cilStop} from "../../../assets/brand/cilStop";
import moment from "moment/moment";
import {ReactComponent as SuccessIcon} from "../../../assets/brand/success.svg"
import {ReactComponent as PlannedIcon} from "../../../assets/brand/schedule.svg"
import {CSpinner} from "@coreui/react";
import {SelectDateModal} from "./SelectDateModal";


const BucketClonePage = memo(() => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedSettingId, setSelectedSettingId] = useState("");
    const [clustersWithKey, setClustersWithKey] = useState([]);

    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [startInProgress, setStartInProgress] = useState(false);
    const [stopInProgress, setStopInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [clusterSourceFilter, setClusterSourceFilter] = useState([]);
    const [clusterTargetFilter, setClusterTargetFilter] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const [changeDataState, setChangeDataState] = useState(new Map());
    // const [sessionsForStart, setSessionsForStart] = useState(new Map());
    // const [sessionsForStop, setSessionsForStop] = useState(new Map());

    const {data: clusters, status: clustersStatus} = useClusters();
    const [settings, settingsStatus, refetch] = useSettingsSynch();
    const [setting, clusterStatus] = useSettingSynch(selectedSettingId);
    const [deleteSetting] = useDeleteSettingSynch();


    const handleSelect = (id) => {
        setSelectedSettingId(id);
        setShowEditDialog(true)
    }

    useEffect(() => {
        if (params?.id) {
            handleSelect(params?.id);
        }
    }, [params]);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm}) => (
            <div
                style={{
                    padding: 15,
                }}
            >
                <Input
                    ref={searchInput}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                    }}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                        width: 250,
                    }}
                />
                <Space>
                    <Button
                        onClick={clearFilters}
                        size="small"
                    >
                        Очистить
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                    >
                        Поиск
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });

    useEffect(() => {
        let result = []
        if (settings && settings.length > 0) {
            result = settings?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setClustersWithKey(result)
    }, [settings]);

    useEffect(() => {
        const options = []
        if (clusterStatus === "success") {
            clusters && clusters.length > 0 && clusters?.map((item: ClusterModel) => {
                options.push({
                    text: item.name,
                    value: item.id,
                })
            })
            setClusterSourceFilter(options)
            setClusterTargetFilter(options)
        }

    }, [clusters, clusterStatus]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление настройки",
            text: `Вы уверены, что хотите удалить найстройку ${name}?`,
            onSubmit: async () => {
                deleteSetting(id);
                modals.closeModal(modalId);
            },
        }));
    };
    const clearFilters = () => {
        setFilteredInfo({});
        setSearchText("");
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const tableLocale: TableLocale = {
        filterReset: <span onClick={clearFilters}>{'Очистить'}</span>,
        // emptyText: <div style={{backgroundImage:cilMenu}}>Нет данных</div>,
    }

    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        setFilteredInfo(filters);
        // setSearchText(filters.clusterName);
    };


    const onRunShceduled = () => {
        if (selectedRowKeys.length === 0) {
            message.error("Выберите сессию");
            return
        }
        if (selectedRows[0].stateRunning === "on") {
            message.error("Сессия уже запущена");
            return
        }
        if (selectedRows[0].stateRunning === "off") {
            message.error("Сессия уже закончена");
            return
        }
        modals.openModal(SelectDateModal, (modalId) => ({
            title: "Запуск сессии по рассписанию",
            text: `Укажите дату запуска сессии`,
            onSubmit: (date) => {
                runSessionScheduled(date);
                modals.closeModal(modalId);
            },
        }));
    };


    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            defaultSortOrder: 'descend',
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{color: 'gray'}}>{item}</div>
            </Link>),
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        {
            title: 'Наименование',
            dataIndex: 'ruleName',
            key: 'ruleName',
            ...getColumnSearchProps('ruleName'),
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>),
            filteredValue: filteredInfo.ruleName || null,
            filterSearch: true,
            sorter: (a, b) => a.ruleName.length - b.ruleName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },

        {
            title: 'Кластер источник',
            dataIndex: 'clusterSourceId"',
            key: 'clusterSourceId"',
            filters: clusterSourceFilter,
            filterSearch: true,
            filteredValue: filteredInfo.clusterSourceId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.clusterSourceName}</div>
            </Link>),
            onFilter: (value, record) => record.clusterSourceId === parseInt(value),
            // ...getColumnSearchProps('clusterName'),
            sorter: (a, b) => a?.clusterSourceId - b?.clusterSourceId,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },

        {
            title: 'Кластер приемник',
            dataIndex: 'clusterTargetId"',
            key: 'clusterTargetId"',
            filters: clusterTargetFilter,
            filterSearch: true,
            filteredValue: filteredInfo.clusterTargetId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.clusterTargetName}</div>
            </Link>),
            onFilter: (value, record) => record.clusterTargetId === parseInt(value),
            // ...getColumnSearchProps('clusterName'),
            sorter: (a, b) => a?.clusterTargetId - b?.clusterTargetId,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            // filters: clusterTargetFilter,
            // filterSearch: true,
            // filteredValue: filteredInfo.clusterTargetId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>
                    {record?.stateRunning === "on" &&
                        <div className="d-flex justify-content-center">
                            <CSpinner size="sm" color="success"/>
                        </div>}

                    {record?.stateRunning === "off" &&
                        <SuccessIcon
                            style={{width: '20px', display: 'flex', margin: '-10px auto -10px auto'}}/>
                    }

                    {record?.stateSession === "init" && !record?.stateRunning &&
                        <PlannedIcon
                            style={{width: '20px', display: 'flex', margin: '-10px auto -10px auto'}}/>
                    }

                </div>
            </Link>),
            // onFilter: (value, record) => record.clusterTargetId === parseInt(value),
            ...getColumnSearchProps('status'),
            // sorter: (a, b) => a?.clusterTargetId - b?.clusterTargetId,
            // sortDirections: ['ascend', 'descend', 'ascend'],
            // ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Дата изменения',
            dataIndex: 'logChangeDate',
            key: 'logChangeDate',
            ...getColumnSearchProps('logChangeDate'),
            // filterSearch: true,
            // filteredValue: filteredInfo.recordTypeId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div
                    style={{width: '100%'}}>{record?.logChangeDate && moment(record?.logChangeDate).format("YYYY-MM-DD HH:mm:ss") || "-"}</div>
            </Link>),
            // onFilter: (value, record) => record.recordTypeId === parseInt(value),
            // sorter: (a, b) => a.recordTypeId - b.recordTypeId,
            // sortDirections: ['ascend', 'descend', 'ascend'],
            // ellipsis: true,
            // width: '120px',
        },
        {
            title: 'Дата запуска',
            dataIndex: 'runDate',
            key: 'runDate',
            ...getColumnSearchProps('runDate'),
            // filterSearch: true,
            // filteredValue: filteredInfo.recordTypeId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/s3clone/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div
                    style={{width: '100%'}}>{record?.runDate && moment(record?.runDate).format("YYYY-MM-DD HH:mm:ss") || "-"}</div>
            </Link>),
            // onFilter: (value, record) => record.recordTypeId === parseInt(value),
            // sorter: (a, b) => a.recordTypeId - b.recordTypeId,
            // sortDirections: ['ascend', 'descend', 'ascend'],
            // ellipsis: true,
            // width: '120px',
        },

    ];


    const rowSelectionChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedRowKeys(selectedRowKeys)
        setSelectedRows(selectedRows)
        setSelectedIds(selectedRowKeys)
    }

    const rowSelection = {
        type: 'radio',
        selectedRowKeys: selectedRowKeys, onSelectAll: (selected, selectedRows, changeRows) => {
            if (selectedRowKeys.length === 0) {
                setSelectedRowKeys([]);
                setSelectedIds([]);
                setSelectedRows([])
            }
        }, onChange: (selectedRowKeys, selectedRows) => {
            rowSelectionChange(selectedRowKeys, selectedRows)
        },
    };


    const runSessionScheduled = useCallback((date) => {
        console.log("date", date)
        // if (selectedRowKeys.length === 0) {
        //     message.error("Выберите сессию");
        // }
        setStartInProgress(true)

        const data = selectedRowKeys
        setSelectedRowKeys([])
        setSelectedRows([])
        setSelectedIds([])

        data.map((item) => {
            try {
                const _synchs = changeDataState
                _synchs.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/setting/settingSync/start/schedule/${item}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    // body: JSON.stringify({...item, status: !item.status})

                }).pipe(switchMap(response => {
                    if (response.ok) {
                        // OK return data
                        return response.json();
                    } else {
                        // Server is returning a status requiring the client to try something else.
                        return of({error: true, message: `Error ${response.status}`});
                    }
                }), catchError(err => {
                    if (err instanceof DOMException && err.name === "AbortError") {
                        // console.log("Check connection was cancelled intentionally ");
                        return of({error: true, message: err.message})
                    } else {
                        // Network or other error, handle appropriately
                        // console.error(err);
                        return of({error: true, message: err.message})
                    }
                }));

                data$.subscribe({
                    next: result => {
                        _synchs.delete(item)
                        setChangeDataState(_synchs)
                    },
                    complete: () => {
                        refetch()
                        message.success("Cессия запланирована");
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })
        setStartInProgress(false)

    }, [selectedRowKeys, selectedRows])

    const deleteSessions = useCallback(() => {
        if (selectedIds.length === 0) {
            message.error("Выберите правило");
        }
        setDeleteInProgress(false)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedIds([])
        ids.map((item) => {
            try {
                const _synchs = changeDataState
                _synchs.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/setting/settingSync/${item}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json', // 'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
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
                    // console.error(err);
                    return of({error: true, message: err.message})

                }));

                data$.subscribe({
                    next: result => {
                        _synchs.delete(item)
                        setChangeDataState(_synchs)
                    },
                    complete: () => {
                        refetch()
                        message.success("Cессия удалена");
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })
        setDeleteInProgress(false)
    }, [selectedRowKeys, selectedIds])

    const stopSessions = useCallback(() => {
        if (selectedRowKeys.length === 0) {
            message.error("Выберите сессию");
        }
        if (!selectedRows[0].stateRunning || selectedRows[0].stateRunning === "") {
            message.error("Сессия еще не запущена");
            return
        }

        if (selectedRows[0].stateRunning === "off") {
            message.error("Сессия уже закончена");
            return
        }
        setStopInProgress(true)

        const data = selectedRowKeys
        setSelectedRowKeys([])
        setSelectedRows([])
        setSelectedIds([])

        data.map((item) => {
            try {
                const _synchs = changeDataState
                _synchs.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/setting/settingSync/stop/${item}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    // body: JSON.stringify({...item, status: !item.status})

                }).pipe(switchMap(response => {
                    if (response.ok) {
                        // OK return data
                        return response.json();
                    } else {
                        // Server is returning a status requiring the client to try something else.
                        return of({error: true, message: `Error ${response.status}`});
                    }
                }), catchError(err => {
                    if (err instanceof DOMException && err.name === "AbortError") {
                        // console.log("Check connection was cancelled intentionally ");
                        return of({error: true, message: err.message})
                    } else {
                        // Network or other error, handle appropriately
                        // console.error(err);
                        return of({error: true, message: err.message})
                    }
                }));

                data$.subscribe({
                    next: result => {
                        _synchs.delete(item)
                        setChangeDataState(_synchs)
                    },
                    complete: () => {
                        refetch()
                        message.success("Cессия остановлена");
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })
        setStopInProgress(false)


    }, [selectedRowKeys, selectedRows])

    const runSessionsManual = useCallback(() => {
        if (selectedRowKeys.length === 0) {
            message.error("Выберите сессию");
            return;
        }
        if (selectedRows[0].stateRunning === "on") {
            message.error("Сессия уже запущена");
            return
        }
        if (selectedRows[0].stateRunning === "off") {
            message.error("Сессия уже закончена");
            return
        }
        setStartInProgress(true)

        const data = selectedRowKeys
        setSelectedRowKeys([])
        setSelectedRows([])
        setSelectedIds([])

        data.map((item) => {
            try {
                const _synchs = changeDataState
                _synchs.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/setting/settingSync/start/manual/${item}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    // body: JSON.stringify({...item, status: !item.status})

                }).pipe(switchMap(response => {
                    if (response.ok) {
                        // OK return data
                        return response.json();
                    } else {
                        // Server is returning a status requiring the client to try something else.
                        return of({error: true, message: `Error ${response.status}`});
                    }
                }), catchError(err => {
                    if (err instanceof DOMException && err.name === "AbortError") {
                        // console.log("Check connection was cancelled intentionally ");
                        return of({error: true, message: err.message})
                    } else {
                        // Network or other error, handle appropriately
                        // console.error(err);
                        return of({error: true, message: err.message})
                    }
                }));

                data$.subscribe({
                    next: result => {
                        _synchs.delete(item)
                        setChangeDataState(_synchs)
                    },
                    complete: () => {
                        refetch()
                        message.success("Cессия запущена");
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })
        setStartInProgress(false)

    }, [selectedRowKeys, selectedRows])

    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            float: 'left'
        }}> Быстрое копирование</h5>

        <Space
            style={{
                margin: '0px 0 20px 0',
                float: 'right'
            }}>

            <Tooltip title={"Добавить сессию"}>
                <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                        onClick={() => setShowEditDialog(true)}
                />
            </Tooltip>

            <Tooltip title={"Удалить сессию"}>
                <Button shape="rounde" icon={<CIcon icon={cilTrash}/>}
                        loading={deleteInProgress}
                        disabled={deleteInProgress}
                        onClick={() => deleteSessions()}
                />
            </Tooltip>

            <Tooltip title={"Начать сессию"}>
                <Button shape="rounde" icon={<CIcon icon={cilMediaPlay}/>}
                        onClick={() => runSessionsManual()}
                        disabled={startInProgress}
                />
            </Tooltip>
            <Tooltip title={"Остановить сессию"}>
                <Button shape="rounde" icon={<CIcon icon={cilStop}/>}
                        disabled={stopInProgress}
                        onClick={() => stopSessions()}
                />
            </Tooltip>
            <Tooltip title={"Запустить сессию по рассписанию"}>
                <Button shape="rounde" icon={<CIcon icon={cilMediaStepForward}/>}
                        disabled={startInProgress}
                        onClick={onRunShceduled}
                />
            </Tooltip>


            <Tooltip title={"Очистить фильтр"}>
                <Button shape="rounde" icon={<CIcon icon={cilBrushAlt}/>} onClick={clearFilters}/>
            </Tooltip>
        </Space>

        <Table
            loading={settingsStatus === "loading"}
            columns={columns}
            dataSource={clustersWithKey}
            onChange={onChange}
            size={"small"}
            pagination={{
                defaultPageSize: defaultPageSize,
                showSizeChanger: true,
            }}
            rowSelection={rowSelection}
            rowKey={record => record.id}
            locale={tableLocale}
        />
        <CreateOrUpdateCloneRule open={showEditDialog}
                                 data={setting}
                                 onClose={() => {
                                     setShowEditDialog(false)
                                     setSelectedSettingId("")
                                     navigate('/s3clone', {replace: true});
                                 }}/></>
});

export default BucketClonePage;
