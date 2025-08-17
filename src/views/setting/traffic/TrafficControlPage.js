import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useModals} from "../../../hooks/useModals";
import {Button, Dropdown, Input, message, Space, Spin, Table, TableProps, Tooltip} from "antd";
import {AimOutlined, CheckOutlined, ClearOutlined, SearchOutlined, UserOutlined} from "@ant-design/icons";
import {DeleteModal} from "../../../components/DeleteModal";
import {TableLocale} from "antd/es/table/interface";
import {Link} from "react-router-dom";
import CIcon from "@coreui/icons-react";
import CreateOrUpdateTrafficRule from "./CreateOrUpdateTrafficRule";
import {useSettingsTraffic} from "../../../hooks/setting/traffic/useSettingsTraffic";
import {useDeleteSettingTraffic} from "../../../hooks/setting/traffic/useDeleteSettingTraffic";
import {useSettingTraffic} from "../../../hooks/setting/traffic/useSettingTraffic";
import {useUsers} from "../../../hooks/reference/user/useUsers";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import type {UserModel} from "../../../models/reference/user.model";
import type {ClusterModel} from "../../../models/reference/cluster.model";
import {useSynchAllSettingTraffic} from "../../../hooks/setting/traffic/useSynchAllSettingTraffic";
import {ReactComponent as ActiveIcon} from "../../../assets/brand/success.svg"
import {ReactComponent as InactiveIcon} from "../../../assets/brand/inactive.svg"
import {NewReleasesOutlined} from "@material-ui/icons";
import {useSynchNewSettingTraffic} from "../../../hooks/setting/traffic/useSynchNewSettingTraffic";
import {useSynchByIdsSettingTraffic} from "../../../hooks/setting/traffic/useSynchByIdsSettingTraffic";
import {useCancelSettingTraffic} from "../../../hooks/setting/traffic/useCancelSettingTraffic";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";
import {cilBrushAlt, cilPlus, cilSync, cilTrash} from "@coreui/icons";
import {ReactComponent as FullIcon} from "../../../assets/brand/cycle.svg"
import {ReactComponent as LimitIcon} from "../../../assets/brand/limit.svg"
import moment from "moment/moment";


const TrafficControlPage = memo(() => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();
    const [onlyNewRules, setOnlyNewRules] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [doSynch, setDoSynch] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState("");
    const [clustersWithKey, setClustersWithKey] = useState([]);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);
    const [clusterFilter, setClusterFilter] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [changeActivityInProgress, setChangeActivityInProgress] = useState(false);
    const [synchData, setSynchData] = useState(new Map());
    const {data: settings, status: settingsStatus, refetch} = useSettingsTraffic();
    const [setting, clusterStatus] = useSettingTraffic(selectedItemId);
    const [deleteSetting] = useDeleteSettingTraffic();
    const [users, usersStatus] = useUsers()
    const {data: clusters, status: clustersStatus} = useClusters();

    const {mutate: startSynch, status: allSynchStatus} = useSynchAllSettingTraffic()
    const {mutate: newSynch, status: newSynchStatus} = useSynchNewSettingTraffic()
    const {mutate: byIdsSynch, status: byIdsSynchStatus} = useSynchByIdsSettingTraffic()
    const {mutate: cancel, status: cancelStatus} = useCancelSettingTraffic()

    useEffect(() => {
        if (allSynchStatus === "loading") {
            message.info(`Синхронизация всех правил в процессе...`)
        }
    }, [allSynchStatus])

    useEffect(() => {
        if (newSynchStatus === "loading") {
            message.info(`Синхронизация новых правил в процессе...`)
        }
    }, [newSynchStatus])

    useEffect(() => {
        if (byIdsSynchStatus === "loading") {
            message.info(`Синхронизация выбранных правил в процессе...`)
        }
    }, [byIdsSynchStatus])

    useEffect(() => {
        const options = []
        if (usersStatus === "success") {
            users && users.length > 0 && users?.map((item: UserModel) => {
                options.push({
                    text: item.lastName,
                    value: item.id,
                })
            })
            setUserFilter(options)
        }

    }, [users, usersStatus]);

    useEffect(() => {
        const options = []
        if (clustersStatus === "success") {
            clusters && clusters.length > 0 && clusters?.map((item: ClusterModel) => {
                options.push({
                    text: item.name,
                    value: item.id,
                })
            })
            setClusterFilter(options)
        }

    }, [clusters, clustersStatus]);

    const handleSelect = (id) => {
        setSelectedItemId(id);
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

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление настройки",
            text: `Вы уверены, что хотите удалить найстройку для правила ${name}?`,
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


    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            defaultSortOrder: 'descend',
            render: (item, record) => (<Link className={'table-link'} to={`/settings/traffic/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{color: 'gray'}}>{item}</div>
            </Link>),
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        // {
        //     title: 'Наименование',
        //     dataIndex: 'ruleName',
        //     key: 'ruleName',
        //     render: (item, record) => (<Link className={'table-link'} to={`/settings/traffic/${record.id}`}
        //                                      onClick={() => handleSelect(record.id)}>
        //         <div style={{width: '100%'}}>{item}</div>
        //     </Link>),
        //     ...getColumnSearchProps('ruleName'),
        //     filteredValue: filteredInfo.ruleName || null,
        //     filterSearch: true,
        //     sorter: (a, b) => a.ruleName.length - b.ruleName.length,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '30%'
        // },

        {
            title: 'Кластер',
            dataIndex: 'clusterId',
            key: 'clusterId',
            filters: clusterFilter,
            filterSearch: true,
            filteredValue: filteredInfo.clusterId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/settings/traffic/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.clusterName}</div>
            </Link>),
            onFilter: (value, record) => record.clusterId === parseInt(value),
            // ...getColumnSearchProps('clusterName'),
            sorter: (a, b) => a.clusterId - b.clusterId,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },

        {
            title: 'Бакет',
            dataIndex: 'bucket',
            key: 'bucket',
            render: (item, record) => (<Link className={'table-link'} to={`/settings/traffic/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>),
            ...getColumnSearchProps('bucket'),
            filteredValue: filteredInfo.bucket || null,
            filterSearch: true,
            sorter: (a, b) => a?.bucket?.length - b?.bucket?.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },

        {
            title: "Исходный IP",
            dataIndex: 'ipOriginal',
            key: 'ipOriginal',
            ...getColumnSearchProps('ipOriginal'),
            filteredValue: filteredInfo.ipOriginal || null,
            filterSearch: true,
            sorter: (a, b) => a.ipOriginal.length - b.ipOriginal.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },


        {
            title: "Число запросов в сек.",
            dataIndex: 'rps',
            key: 'rps',
            ...getColumnSearchProps('rps'),
            filteredValue: filteredInfo.rps || null,
            filterSearch: true,
            sorter: (a, b) => a.rps.length - b.rps.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },

        {
            title: "Пропускная способность",
            dataIndex: 'throughput',
            key: 'throughput',
            ...getColumnSearchProps('throughput'),
            filteredValue: filteredInfo.throughput || null,
            filterSearch: true,
            sorter: (a, b) => a.throughput.length - b.throughput.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },
        {
            title: 'Методы',
            dataIndex: 'recordTypes',
            key: 'recordTypes',
            ...getColumnSearchProps(''),
            // filterSearch: true,
            // filteredValue: filteredInfo.recordTypeId || null,
            render: (item, record) => (<Link className={'table-link'} to={`/settings/balance/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>
                    {item && item?.length === 0 && <Tooltip title={"Все методы"}>
                        <FullIcon
                            style={{width: '20px', display: 'flex', margin: '-10px auto -10px auto'}}/>
                    </Tooltip>}

                    {item && item?.length > 0 &&
                        <><Tooltip title={item.map(i => i.recordTypeName).join(", ")}>
                            <LimitIcon
                                style={{width: '19px', display: 'flex', margin: '-15px auto -15px auto'}}/>
                        </Tooltip></>}

                </div>
            </Link>),
            // onFilter: (value, record) => record.recordTypeId === parseInt(value),
            // sorter: (a, b) => a.recordTypeId - b.recordTypeId,
            // sortDirections: ['ascend', 'descend', 'ascend'],
            // ellipsis: true,
            width: '80px',
        },
        {
            title: 'Активность',
            dataIndex: 'status',
            key: 'status',
            ...getColumnSearchProps('status'),
            render: (item, record) => <div style={{width: '100%'}}>
                {synchData?.has(record.id) ?
                    <Spin style={{display: 'flex', width: '25px', margin: '0px auto'}}/> :
                    <>
                        {item && <ActiveIcon
                            style={{width: '15px', display: 'flex', margin: '-10px auto -10px auto'}}/>}
                        {(!item || item === null || item === "") && <InactiveIcon
                            style={{width: '13px', display: 'flex', margin: '-10px auto -10 auto'}}/>}
                    </>}
            </div>,
            filteredValue: filteredInfo.status,
            filterSearch: true,
            sorter: (a, b) => (a.status === b.status) ? 0 : a.status ? -1 : 1,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            width: '130px'
        },
        {
            title: 'Синхронизация',
            dataIndex: '',
            key: '',
            ...getColumnSearchProps(''),
            render: (item, record) => <div style={{width: '100%'}}>

                {(!record?.syncDate || record?.syncDate === "") && <InactiveIcon
                    style={{width: '13px', display: 'flex', margin: '-10px auto -10px auto'}}/>}
                <Tooltip title={moment(record?.syncDate).format("YYYY-MM-DD HH:mm:ss")}>
                    {(record?.syncDate && record?.syncDate !== "" && record?.changeDate && record?.changeDate !== "" &&
                        moment(record?.changeDate).isBefore(record?.syncDate, "millisecond")) && <InactiveIcon
                        style={{width: '15px', display: 'flex', margin: '-10px auto -10px auto'}}/>}
                    {(record?.syncDate && record?.syncDate !== "" && record?.changeDate && record?.changeDate !== "" &&
                        (moment(record?.changeDate).isAfter(record?.syncDate, "millisecond") ||
                            moment(record?.changeDate).isSame(record?.syncDate, "millisecond"))) && <ActiveIcon
                        style={{width: '13px', display: 'flex', margin: '-10px auto -10px auto'}}/>}
                </Tooltip>
            </div>,
            // filteredValue: filteredInfo.status,
            filterSearch: true,
            // sorter: (a, b) => (a.status === b.status) ? 0 : a.status ? -1 : 1,
            sortDirections: ['ascend', 'descend', 'ascend'],
            // ellipsis: true,
            width: '130px'
        },

        // {
        //     title: '',
        //     dataIndex: '',
        //     key: 'x',
        //     width: '5%',
        //     render: (item, record) =>
        //         <CDropdown
        //             variant={"btn-group"}
        //             className={"dropdown-position"}
        //         >
        //             <CDropdownToggle custom>
        //                 <CIcon icon={cilMenu}/>
        //             </CDropdownToggle>
        //             <CDropdownMenu>
        //                 <CDropdownItem onClick={() => onDelete(record?.id, record?.ruleName)}>
        //                     Удалить
        //                 </CDropdownItem>
        //             </CDropdownMenu>
        //         </CDropdown>,
        // },
    ];

    const changeStatus = useCallback(() => {
        if (selectedRowKeys.length === 0) {
            message.error("Выберите правило");
        }
        setChangeActivityInProgress(true)

        const data = selectedRowKeys
        setSelectedRowKeys([])
        setSelectedRows([])
        setSelectedIds([])
        data.map((item) => {
            try {
                const _synchs = synchData
                _synchs.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/setting/settingTraffic/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({...item, status: !item.status})

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
                        setSynchData(_synchs)
                    },
                    complete: () => {
                        refetch()
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })

        setChangeActivityInProgress(false)
    }, [selectedRowKeys, selectedRows, synchData])

    const rowSelectionChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedRowKeys(selectedRowKeys)
        setSelectedRows(selectedRows)
        setSelectedIds(selectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys: selectedRowKeys, onSelectAll: (selected, selectedRows, changeRows) => {
            if (selectedRowKeys.length === 0) {
                setSelectedRowKeys([]);
                setSelectedRows([]);
                setSelectedIds([]);
            }
        }, onChange: (selectedRowKeys, selectedRows) => {
            rowSelectionChange(selectedRowKeys, selectedRows)
        },
    };

    const items = [
        {
            label: 'Все правила',
            key: '1',
            icon: <AimOutlined/>,
            onClick: () => startSynch(),
            disabled: (allSynchStatus === "loading") || (newSynchStatus === "loading") || (byIdsSynchStatus === "loading")
        },
        {
            label: 'Только новые правила',
            key: '2',
            icon: <NewReleasesOutlined/>,
            // danger: true,
            onClick: () => newSynch(),
            disabled: (allSynchStatus === "loading") || (newSynchStatus === "loading") || (byIdsSynchStatus === "loading")
        },
        {
            label: 'Только выбранные правила',
            key: '3',
            icon: <UserOutlined/>,
            onClick: () => {
                if (selectedRowKeys.length === 0) {
                    return
                }
                byIdsSynch(selectedRowKeys.map(item => {
                    return {id: item}
                }))
                setSelectedRowKeys([])
            },
            disabled: (allSynchStatus === "loading") || (newSynchStatus === "loading") || (byIdsSynchStatus === "loading")
        },
        {
            label: 'Отменить все правила',
            key: '4',
            icon: <ClearOutlined/>,
            onClick: () => cancel(),
            disabled: cancelStatus === "loading" || (allSynchStatus === "loading") || (newSynchStatus === "loading") || (byIdsSynchStatus === "loading")
        },

    ];
    const handleButtonClick = (e) => {
        // message.info('Click on left button.');
        // console.log('click left button', e);
    };
    const handleMenuClick = (e) => {
        if (e.key === '3' && selectedRowKeys.length === 0) {
            message.error('Выберите правила');
        }
    };


    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const deleteItems = useCallback(() => {
        if (selectedIds.length === 0) {
            message.error("Выберите правило");
        }
        setDeleteInProgress(false)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedIds([])
        ids.map((item) => {
            try {
                const _synchs = synchData
                _synchs.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/setting/settingTraffic/${item}`, {
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
                        _synchs.set(item, result.error ? "ERR" : "OK")
                        setSynchData(_synchs)
                    },
                    complete: () => {
                        refetch()
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })
        setDeleteInProgress(false)
    }, [selectedRowKeys, selectedIds, synchData])


    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            float: 'left'
        }}>Лимиты и квоты</h5>


        <Space
            style={{
                margin: '0px 0 20px 0',
                float: 'right'
            }}
        >
            <Tooltip title={"Сменить активность"}>
                <Button shape="rounde" icon={<CheckOutlined/>}
                        loading={changeActivityInProgress}
                        disabled={changeActivityInProgress}
                        onClick={() => changeStatus()}></Button>
            </Tooltip>

            <Tooltip title={"Синхронизировать"}>
                <Dropdown menu={menuProps}>
                    <Button>
                        <Space>
                            <CIcon icon={cilSync}/>
                        </Space>
                    </Button>
                </Dropdown>
            </Tooltip>


            <Tooltip title={"Добавить правило"}>
                <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                        onClick={() => {
                            setSelectedItemId(null)
                            setShowEditDialog(true)
                        }}/>
            </Tooltip>
            <Tooltip title={"Удалить правило"}>
                <Button shape="rounde" icon={<CIcon icon={cilTrash}/>}
                        loading={deleteInProgress}
                        disabled={deleteInProgress}
                        onClick={() => deleteItems()}/>
            </Tooltip>
            <Tooltip title={"Очистить фильтр"}>
                <Button shape="rounde" icon={<CIcon icon={cilBrushAlt}/>} onClick={clearFilters}/>
            </Tooltip>
        </Space>

        <Table
            loading={clustersStatus === "loading"}
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
        <CreateOrUpdateTrafficRule open={showEditDialog}
                                   data={setting}
                                   onClose={() => {
                                       setShowEditDialog(false)
                                       setSelectedItemId("")
                                       navigate('/settings/traffic', {replace: true});
                                   }}/></>
});

export default TrafficControlPage;
