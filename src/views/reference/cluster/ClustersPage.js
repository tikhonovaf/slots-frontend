import CIcon from "@coreui/icons-react";
import {Button, Input, message, Space, Spin, Table, TableProps, Tooltip} from "antd";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {DeleteModal} from "../../../components/DeleteModal";
import {Link} from "react-router-dom";
import {useModals} from "../../../hooks/useModals";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {TableLocale} from "antd/es/table/interface";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import CreateOrUpdateCluster from "./CreateOrUpdateCluster";
import {useCluster} from "../../../hooks/reference/cluster/useCluster";
import {useDeleteCluster} from "../../../hooks/reference/cluster/useDeleteCluster";
import {useVendors} from "../../../hooks/reference/vendor/useVendors";
import {ReactComponent as SuccessIcon} from "../../../assets/brand/success.svg"
import {ReactComponent as ErrorIcon} from "../../../assets/brand/error.svg"
import {ReactComponent as WarningIcon} from "../../../assets/brand/warning.svg"

import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";

import {cilBrushAlt, cilLink, cilPlus, cilTrash} from "@coreui/icons";


export const ClustersPage = () => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedClusterId, setSelectedClusterId] = useState("");
    const [clustersWithKey, setClustersWithKey] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isInitConnectionCheck, setIsInitConnectionCheck] = useState(false);
    const [connectionData, setConnectionData] = useState(new Map());
    const [connectionInProgress, setConnectionInProgress] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);
    const [vendorFilter, setVendorFilter] = useState([]);

    const {data: clusters, state: clustersStatus, refetch} = useClusters();
    const [cluster, clusterStatus] = useCluster(selectedClusterId);
    const [deleteCluster] = useDeleteCluster();
    const [vendors, vendorsStatus] = useVendors();
    // const [users, usersStatus] = useUsers();


    useEffect(() => {
        if (connectionInProgress) {
            message.info(`Проверка соединения в процессе...`)
        }
    }, [connectionInProgress])

    useEffect(() => {
        setConnectionData(new Map())
    }, [])

    const handleSelect = (id) => {
        setSelectedClusterId(id);
        setShowEditDialog(true)
    }

    useEffect(() => {
        if (clusters && clusters.length > 0 && !isInitConnectionCheck) {
            setSelectedIds(clusters?.map(item => item?.id))
        }
    }, [clusters, isInitConnectionCheck])

    useEffect(() => {
        if (selectedIds.length > 0 && selectedRowKeys.length === 0 && !isInitConnectionCheck) {
            checkConnection()
            setIsInitConnectionCheck(true)
        }
    }, [selectedIds, selectedRowKeys, isInitConnectionCheck])

    useEffect(() => {
        if (params?.id) {
            handleSelect(params?.id);
        }
    }, [params]);

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm}) => (<div
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
                    marginBottom: 8, display: 'block', width: 250,
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
        </div>), filterIcon: (filtered) => (<SearchOutlined
            style={{
                color: filtered ? '#1677ff' : undefined,
            }}
        />), onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });

    useEffect(() => {
        let result = []
        if (clusters && clusters.length > 0) {
            result = clusters?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item, key: index + 1
                }))
        }
        setClustersWithKey(result)
    }, [clusters]);

    // useEffect(() => {
    //     const options = []
    //     if (usersStatus === "success") {
    //         users && users.length > 0 && users?.map(item => {
    //             options.push({
    //                 text: item.firstName + " " + item.lastName, value: item.id,
    //             })
    //         })
    //         setUserFilter(options)
    //     }
    // }, [users, usersStatus]);

    useEffect(() => {
        const options = []
        if (vendorsStatus === "success") {
            vendors && vendors.length > 0 && vendors?.map(item => {
                options.push({
                    text: item.name, value: item.id,
                })
            })
            setVendorFilter(options)
        }
    }, [vendors, vendorsStatus]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление кластера",
            text: 'Вы уверены, что хотите удалить кластер ' + `${name}` + '?',
            onSubmit: async () => {
                deleteCluster(id);
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
        filterReset: <span
            onClick={clearFilters}>{'Очистить'}</span>, // emptyText: <div style={{backgroundImage:cilMenu}}>Нет данных</div>,
    }

    const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        setFilteredInfo(filters);
        console.log('filters', filters);
        // setSearchText(filters.clusterName);
    };

    const columns = [{
        title: '№',
        dataIndex: 'key',
        key: 'key',
        render: (item, record) => (<Link className={'table-link'} to={`/references/clusters/${record.id}`}>
            <div style={{color: 'gray'}}>{record.key}</div>
        </Link>),
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.key - b.key,
        sortDirections: ['ascend', 'descend', 'ascend'],
        width: '5%'
    }, {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name', ...getColumnSearchProps('name'),
        filteredValue: filteredInfo.name || null,
        filterSearch: true,
        render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
                                        onClick={() => handleSelect(record.id)}>
            <div style={{width: '100%'}}>{item}</div>
        </Link>,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['ascend', 'descend', 'ascend'],
        ellipsis: true, // width: '30%'
    }, // {
        //     title: 'Адрес точки доступа кластера',
        //     dataIndex: 'url',
        //     key: 'url',
        //     filterSearch: true,
        //     filteredValue: filteredInfo.url || null,
        //     render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
        //                                     onClick={() => handleSelect(record.id)}>
        //         <div style={{width: '100%'}}><Link to={item}>{item}</Link></div>
        //     </Link>,
        //     ...getColumnSearchProps('url'),
        //     // sorter: (a, b) => a.description.length - b.description.length,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '15%',
        // },
        {
            title: 'Тип кластера',
            dataIndex: 'vendorId',
            key: 'vendorId',
            filters: vendorFilter,
            filterSearch: true,
            filteredValue: filteredInfo.vendorId || null,
            onFilter: (value, record) => record.vendorId === parseInt(value),
            filter: vendorFilter,
            render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.vendorName}</div>
            </Link>, // ...getColumnSearchProps('vendorId'),
            sorter: (a, b) => a.vendorName.length - b.vendorName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '15%',
        },
        {
            title: 'Пользователь',
            dataIndex: 'userId',
            key: 'userId',
            filter: userFilter,
            onFilter: (value, record) => record.userId === parseInt(value),
            filterSearch: true,
            filteredValue: filteredInfo.userId || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.userName}</div>
            </Link>, // ...getColumnSearchProps('userId'),
            sorter: (a, b) => a.userId - b.userId,
            sortDirections: ['ascend', 'descend', 'ascend'], // ellipsis: true,
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
                {connectionData.get(record.id) === "ALL" && <SuccessIcon
                    style={{width: '25px', display: 'flex', margin: '-15px auto -5px auto'}}/>}
                {connectionData.get(record.id) === "SOME" && <WarningIcon
                    style={{width: '25px', display: 'flex', margin: '-10px auto -5px auto'}}/>}
                {connectionData.has(record.id) && (connectionData.get(record.id) === "ERROR" || connectionData.get(record.id) === "NONE" || connectionData.get(record.id) === undefined) &&
                    <ErrorIcon
                        style={{width: '25px', display: 'flex', margin: '-15px auto -5px auto'}}/>}
            </div>,
            width: '90px',
        },
        // {
        //     title: '', dataIndex: '', key: 'x', width: '5%', render: (item, record) => <CDropdown
        //         style={{margin: '10px 0 -5px 0'}}
        //         variant={"btn-group"}
        //         className={"dropdown-position"}
        //     >
        //         <CDropdownToggle custom>
        //             <CIcon icon={cilMenu}/>
        //         </CDropdownToggle>
        //         <CDropdownMenu>
        //             <CDropdownItem onClick={() => onDelete(record?.id, record?.name)}>
        //                 Удалить
        //             </CDropdownItem>
        //         </CDropdownMenu>
        //     </CDropdown>,
        // },
    ];

    const rowSelectionChange = (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        setSelectedRowKeys(selectedRowKeys)
        setSelectedIds(selectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys: selectedRowKeys, onSelectAll: (selected, selectedRows, changeRows) => {
            if (selectedRowKeys.length === 0) {
                setSelectedRowKeys([]);
                setSelectedIds([]);
            }
        }, onChange: (selectedRowKeys, selectedRows) => {
            rowSelectionChange(selectedRowKeys, selectedRows)
        },
    };

    const checkConnection = useCallback(() => {
        if (selectedIds.length === 0) {
            message.error("Выберите кластер");
        }
        // message.info(`Проверка соединения начата`)
        setConnectionInProgress(true)
        const ac = new AbortController()
        setTimeout(() => ac.abort(), 3000)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedIds([])
        ids.map((item) => {
            try {
                const _a = connectionData
                _a.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/clusters/checkAvailability/${item}`, {
                    method: 'GET', signal: ac.signal, headers: {
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
                        _a.set(item, result.error ? "NONE" : result?.status)
                        setConnectionData(_a)
                    },
                    complete: () => {
                        refetch()
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })
        setConnectionInProgress(false)
        // message.info(`Проверка соединения закончена`)
    }, [selectedRowKeys, selectedIds, connectionData])

    const deleteItems = useCallback(() => {
        if (selectedIds.length === 0) {
            message.error("Выберите кластер");
        }
        // message.info(`Удаление кластров начато`)
        setDeleteInProgress(true)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedIds([])
        ids.map((item) => {
            try {
                const _a = connectionData
                _a.set(item, "IN_PROGRESS")
                const data$ = fromFetch(`/api/clusters/${item}`, {
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
            margin: '0 0 30px 0', float: 'left'
        }}>Кластеры S3</h5>

        <Space
            style={{
                margin: '0px', float: 'right'
            }}
        >
            <Tooltip title={"Проверить соединение с кластером"}>
                <Button onClick={checkConnection} icon={<CIcon icon={cilLink}/>}
                        loading={Array.from(connectionData.values())?.includes("IN_PROGRESS")}
                        disabled={Array.from(connectionData.values())?.includes("IN_PROGRESS")}/>
            </Tooltip>
            <Tooltip title={"Добавить кластер"}>
            <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                    onClick={() => setShowEditDialog(true)}/>
            </Tooltip>
            <Tooltip title={"Удалить кластер"}>
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
            onChange={handleTableChange}
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
        < CreateOrUpdateCluster open={showEditDialog}
                                data={cluster}
                                onClose={() => {
                                    setShowEditDialog(false)
                                    setSelectedClusterId("")
                                    navigate('/references/clusters', {replace: true});
                                }}/></>

}