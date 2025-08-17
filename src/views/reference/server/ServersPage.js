import CIcon from "@coreui/icons-react";
import {Button, Input, message, Space, Spin, Table, TableProps, Tooltip} from "antd";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {DeleteModal} from "../../../components/DeleteModal";
import {Link} from "react-router-dom";
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/react";
import {cilMenu} from "../../../assets/brand/cilMenu";
import {useModals} from "../../../hooks/useModals";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {TableLocale} from "antd/es/table/interface";
import CreateOrUpdateServer from "./CreateOrUpdateServer";
import {useVendors} from "../../../hooks/reference/vendor/useVendors";
import {useUsers} from "../../../hooks/reference/user/useUsers";
import {useServers} from "../../../hooks/reference/server/useServers";
import {useServer} from "../../../hooks/reference/server/useServer";
import {useDeleteServer} from "../../../hooks/reference/server/useDeleteServer";
import {useServerTypes} from "../../../hooks/reference/server/useServerTypes";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";

import {ReactComponent as SuccessIcon} from "../.././../assets/brand/success.svg"
import {ReactComponent as ErrorIcon} from "../.././../assets/brand/error.svg"
import {cilBrushAlt, cilLink, cilPlus, cilSync, cilTrash} from "@coreui/icons";


export const ServersPage = () => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedServerId, setSelectedServerId] = useState("");
    const [selectedServerStatus, setSelectedServerStatus] = useState("");
    const [clustersWithKey, setClustersWithKey] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);
    const [serverTypeFilter, setServerTypeFilter] = useState([]);
    const [vendorFilter, setVendorFilter] = useState([]);
    const [connectionInProgress, setConnectionInProgress] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [isInitConnectionCheck, setIsInitConnectionCheck] = useState(false);
    const [syncInProgress, setSyncInProgress] = useState(false);
    const [connectionData, setConnectionData] = useState(new Map());
    const [synchData, setSynchData] = useState(new Map());
    const {data: servers, status: serversStatus, refetch} = useServers();
    const [server, serverStatus] = useServer(selectedServerId);
    const [deleteServer] = useDeleteServer();
    const [vendors, vendorsStatus] = useVendors();
    const [users, usersStatus] = useUsers();
    const [serverTypes, serverTypesStatus] = useServerTypes();

    useEffect(() => {
        if (syncInProgress) {
            message.info(`Синхронизация в процессе...`)
        }
    }, [syncInProgress])

    useEffect(() => {
        if (connectionInProgress) {
            message.info(`Проверка соединения в процессе...`)
        }
    }, [connectionInProgress])

    // useEffect(() => {
    //     if (newSynchStatus === "loading") {
    //         message.info(`Синхронизация новых правил в процессе...`)
    //     }
    // }, [newSynchStatus])
    //
    // useEffect(() => {
    //     if (byIdsSynchStatus === "loading") {
    //         message.info(`Синхронизация выбранных правил в процессе...`)
    //     }
    // }, [byIdsSynchStatus])

    const handleSelect = (id) => {
        setSelectedServerId(id);
        setShowEditDialog(true)
        setSelectedServerStatus(connectionData.get(id))
    }

    useEffect(() => {
        if (params?.id) {
            handleSelect(params?.id);
        }
    }, [params]);

    useEffect(() => {
        if (servers && servers.length > 0 && !isInitConnectionCheck) {
            setSelectedAddresses(servers?.filter(item => item.serverUrls && item.serverUrls.length > 0).map(server => server?.serverUrls[0].url + ":" + server?.serverUrls[0].port))
            setSelectedIds(servers?.map(item => item?.id))
        }
    }, [servers, isInitConnectionCheck])

    useEffect(() => {
        if (selectedIds.length > 0 && selectedRowKeys.length === 0 && !isInitConnectionCheck) {
            checkConnection()
            doSynchConfigs()
            setIsInitConnectionCheck(true)
        }
    }, [selectedIds, selectedRowKeys, isInitConnectionCheck])

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
        if (servers && servers.length > 0) {
            result = servers?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setClustersWithKey(result)
    }, [servers]);

    useEffect(() => {
        const options = []
        if (usersStatus === "success") {
            users && users.length > 0 && users?.map(item => {
                options.push({
                    text: item.firstName + " " + item.lastName,
                    value: item.id,
                })
            })
            setUserFilter(options)
        }
    }, [users, usersStatus]);

    useEffect(() => {
        const options = []
        if (serverTypesStatus === "success") {
            serverTypes && serverTypes.length > 0 && serverTypes?.map(item => {
                options.push({
                    text: item.name,
                    value: item.id,
                })
            })
            setServerTypeFilter(options)
        }
    }, [serverTypes, serverTypesStatus]);


    useEffect(() => {
        const options = []
        if (vendorsStatus === "success") {
            vendors && vendors.length > 0 && vendors?.map(item => {
                options.push({
                    text: item.name,
                    value: item.id,
                })
            })
            setVendorFilter(options)
        }
    }, [vendors, vendorsStatus]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление сервера",
            text: 'Вы уверены, что хотите удалить сервер ' + `${name}` + '?',
            onSubmit: async () => {
                deleteServer(id);
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
            render: (item, record) => (<Link className={'table-link'} to={`/references/servers/${record.id}`}>
                <div style={{color: 'gray'}}>{record.key}</div>
            </Link>),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            filteredValue: filteredInfo.name || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/servers/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },
        {
            title: 'Aдрес',
            dataIndex: 'serverUrls',
            key: 'serverUrls',
            filterSearch: true,
            filteredValue: filteredInfo.serverUrls || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/servers/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item && item.length > 0 && item[0].url + ":" + item[0].port}</div>
            </Link>,
            ...getColumnSearchProps('serverUrls'),
            // sorter: (a, b) => a.description.length - b.description.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Тип сервера',
            dataIndex: 'serverTypeId',
            key: 'serverTypeId',
            filters: serverTypeFilter,
            filterSearch: true,
            filteredValue: filteredInfo.serverTypeId || null,
            onFilter: (value, record) => record.serverTypeId === parseInt(value),
            filter: serverTypeFilter,
            render: (item, record) => <Link className={'table-link'} to={`/references/servers/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.serverTypeName}</div>
            </Link>,
            // ...getColumnSearchProps('vendorId'),
            sorter: (a, b) => a.serverTypeId - b.serverTypeId,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Доступность', // dataIndex: 'comment',
            // key: 'comment',
            ...getColumnSearchProps(''), // filteredValue: filteredInfo.name || null,
            // filterSearch: true,
            render: (item, record) => <div style={{width: '100%'}}>
                {connectionData.get(record.id) === "IN_PROGRESS" &&
                    <Spin style={{display: 'flex', width: '25px', margin: '0px auto'}}/>}
                {connectionData.get(record.id) === "OK" && <SuccessIcon
                    style={{width: '15px', display: 'flex', margin: '-15px auto -5px auto'}}/>}
                {connectionData.get(record.id) === "ERR" && <ErrorIcon
                    style={{width: '25px', display: 'flex', margin: '-15px auto -5px auto'}}/>}
            </div>,
            width: '90px',
        },
        {
            title: 'Синхронизация', // dataIndex: 'comment',
            // key: 'comment',
            ...getColumnSearchProps(''), // filteredValue: filteredInfo.name || null,
            // filterSearch: true,
            render: (item, record) => <div style={{width: '100%'}}>
                {synchData.get(record.id) === "IN_PROGRESS" &&
                    <Spin style={{display: 'flex', width: '25px', margin: '0px auto'}}/>}
                {synchData.get(record.id) === "OK" && <SuccessIcon
                    style={{width: '15px', display: 'flex', margin: '-15px auto -5px auto'}}/>}
                {synchData.get(record.id) === "ERR" && <ErrorIcon
                    style={{width: '25px', display: 'flex', margin: '-15px auto -5px auto'}}/>}
                {/*{synchData.get(record.id) }*/}
            </div>,
            width: '90px',
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            width: '5%',
            render: (item, record) =>
                <CDropdown
                    style={{margin: '10px 0 -5px 0'}}
                    variant={"btn-group"}
                    className={"dropdown-position"}
                >
                    <CDropdownToggle custom>
                        <CIcon icon={cilMenu}/>
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem onClick={() => onDelete(record?.id, record?.name)}>
                            Удалить
                        </CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>,
        },
    ];

    const rowSelectionChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedRowKeys(selectedRowKeys)
        setSelectedAddresses(selectedRows.filter(item => item.serverUrls && item.serverUrls.length > 0).map(server => server?.serverUrls[0].url + ":" + server?.serverUrls[0].port))
        setSelectedIds(selectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys: selectedRowKeys, onSelectAll: (selected, selectedRows, changeRows) => {
            if (selectedRowKeys.length === 0) {
                setSelectedRowKeys([]);
                setSelectedAddresses([])
                setSelectedIds([])
            }
        },
        onChange: (selectedRowKeys, selectedRows) => {
            rowSelectionChange(selectedRowKeys, selectedRows)

        },
    };

    const doSynchConfigs = useCallback(() => {
        if (selectedIds.length === 0) {
            message.error("Выберите сервер");
        }
        // message.info(`Синхронизация начата`)
        const ac = new AbortController()
        setTimeout(() => ac.abort(), 2000)
        setSyncInProgress(true)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedIds([])
        ids.map((item) => {
            const _synchs = synchData
            _synchs.set(item, "IN_PROGRESS")
            const data$ = fromFetch(`/api/syncSetup/syncNginxConfig/${item}`, {
                method: 'GET',
                signal: ac.signal,
                headers: {
                    'Content-Type': 'application/json',
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
                    _synchs.set(item, result.error ? "ERR" : result?.result)
                    setSynchData(_synchs)
                },
                complete: () => {
                    refetch()

                }
            });
        })
        setSyncInProgress(false)
        // message.info(`Синхронизация закончена`)
    }, [selectedRowKeys, selectedIds, synchData])

    const checkConnection = useCallback(() => {
        if (selectedAddresses.length === 0) {
            message.error("Выберите сервер");
        }
        // message.info(`Проверка соединения начата`)
        setConnectionInProgress(true)
        const ac = new AbortController()
        setTimeout(() => ac.abort(), 2000)
        const addresses = selectedAddresses
        const ids = selectedIds
        setSelectedAddresses([])
        setSelectedIds([])
        setSelectedRowKeys([])
        addresses.map((item, index) => {
            const _connections = connectionData
            _connections.set(ids[index], "IN_PROGRESS")
            setConnectionData(_connections)
            const data$ = fromFetch(`${item}`, {
                method: 'GET',
                signal: ac.signal,
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
                    _connections.set(ids[index], result.error ? "ERR" : result?.status)
                    setConnectionData(_connections)
                },
                complete: () => {
                    refetch()
                }
            });
        })
        setConnectionInProgress(false)
        // message.info(`Проверка соединения закончена`)
    }, [selectedAddresses, selectedIds, connectionData])

    const deleteItems = useCallback(() => {
        if (selectedIds.length === 0) {
            message.error("Выберите сервер");
        }
        // message.info(`Удаление серверов начато`)
        setDeleteInProgress(false)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedIds([])
        ids.map((item) => {
            try {
                const _a = connectionData
                _a.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/servers/${item}`, {
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
    }, [selectedRowKeys, selectedIds])

    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            width: '100%'
        }}>Серверы S3traf</h5>

        <Space
            style={{
                margin: '-20px 0 20px 0',
                float: 'right'
            }}
        >

            <Tooltip title={"Синхронизировать"}>
                <Button onClick={doSynchConfigs} icon={<CIcon icon={cilSync}/>}
                        disabled={Array.from(synchData.values())?.includes("IN_PROGRESS")}
                        loading={Array.from(synchData.values())?.includes("IN_PROGRESS")}/>
            </Tooltip>


            <Tooltip title={"Проверить соединение с сервером"}>
                <Button onClick={checkConnection} icon={<CIcon icon={cilLink}/>}
                        loading={Array.from(connectionData.values())?.includes("IN_PROGRESS")}
                        disabled={Array.from(connectionData.values())?.includes("IN_PROGRESS")}/>
            </Tooltip>
            <Tooltip title={"Добавить сервер"}>
                <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                        onClick={() => setShowEditDialog(true)}/>
            </Tooltip>
            <Tooltip title={"Удалить сервер"}>
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
            loading={serversStatus === "loading"}
            columns={columns}
            dataSource={clustersWithKey}
            onChange={onChange}
            size={"small"}
            // pagination={{
            //     defaultPageSize: defaultPageSize,
            //     showSizeChanger: true,
            // }}
            pagination={false}
            scroll={{x: "max-content",}}
            rowSelection={rowSelection}
            rowKey={record => record.id}
            locale={tableLocale}
        />
        <CreateOrUpdateServer open={showEditDialog}
                              data={server}
                              onClose={() => {
                                  setShowEditDialog(false)
                                  setSelectedServerId("")
                                  navigate('/references/servers', {replace: true});
                              }}/></>

}