import CIcon from "@coreui/icons-react";
import {Button, Input, message, Space, Spin, Table, TableProps, Tooltip} from "antd";
import moment from 'moment';

import React, {useCallback, useEffect, useRef, useState} from "react";
import {DeleteModal} from "../../../components/DeleteModal";
import {Link} from "react-router-dom";
import {useModals} from "../../../hooks/useModals";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {TableLocale} from "antd/es/table/interface";
import {useSlots} from "../../../hooks/slot/useSlots";
import CreateOrUpdateSlot from "./CreateOrUpdateSlot";
import {useCluster} from "../../../hooks/reference/cluster/useCluster";
import {useDeleteCluster} from "../../../hooks/reference/cluster/useDeleteCluster";
import {useStores} from "../../../hooks/reference/store/useStores";
import {ReactComponent as SuccessIcon} from "../../../assets/brand/success.svg"
import {ReactComponent as ErrorIcon} from "../../../assets/brand/error.svg"
import {ReactComponent as WarningIcon} from "../../../assets/brand/warning.svg"

import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";

import {cilBrushAlt, cilLink, cilPlus, cilTrash} from "@coreui/icons";


export const SlotsPage = () => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedClusterId, setSelectedClusterId] = useState("");
    const [slotsWithKey, setSlotsWithKey] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [connectionInProgress, setConnectionInProgress] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);
    const [storesFilter, setStoresFilter] = useState([]);

    const {data: slots, state: slotsStatus, refetch} = useSlots(filteredInfo);
    const [cluster, clusterStatus] = useCluster(selectedClusterId);
    const [deleteCluster] = useDeleteCluster();
    const [stores, storesStatus] = useStores();
    // const [users, usersStatus] = useUsers();


    useEffect(() => {
        if (connectionInProgress) {
            message.info(`Проверка соединения в процессе...`)
        }
    }, [connectionInProgress])

    const handleSelect = (id) => {
        setSelectedClusterId(id);
        setShowEditDialog(true)
    }

    useEffect(() => {
        if (slots && slots.length > 0) {
            setSelectedIds(slots?.map(item => item?.id))
        }
    }, [slots])

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
        setSlotsWithKey(
            (slots && slots.length > 0)
                ? slots
                    .sort((a, b) => a.nSlotId - b.nSlotId)
                    .map((item, index) => ({
                        ...item, key: index + 1
                    }))
                : []
        )
    }, [slots]);

    useEffect(() => {
        const options = []
        if (storesStatus === "success") {
            stores && stores.length > 0 && stores?.map(item => {
                options.push({
                    text: item.vcName, value: item.nStoreId,
                })
            })
            setStoresFilter(options)
        }
    }, [stores, storesStatus]);

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

    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            render: (item, record) => (<Link className={'table-link'} to={`/references/slots/${record.nSlotId}`}>
                <div style={{color: 'gray'}}>{record.key}</div>
            </Link>),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        {
            title: 'Дата',
            dataIndex: 'dDate',
            key: 'dDate', ...getColumnSearchProps('dDate'),
            filteredValue: filteredInfo.dDate || null,
            filterSearch: true,
            render: (item, record) => <div style={{width: '100%'}}>{record.dDate ? moment(record.dDate).format('DD.MM.YYYY') : ''}</div>,
            sorter: (a, b) => a.dDate.length - b.dDate.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '30%'
        },
        {
            title: 'Начало',
            dataIndex: 'dStartTime',
            key: 'dStartTime',
            ...getColumnSearchProps('dStartTime')
        },
        {
            title: 'Окончание',
            dataIndex: 'dEndTime',
            key: 'dEndTime',
            ...getColumnSearchProps('dEndTime')
        },
        {
            title: 'Пункт налива',
            dataIndex: 'nLoadingPointId',
            key: 'nLoadingPointId',
            filter: userFilter,
            onFilter: (value, record) => record.nLoadingPointId === parseInt(value),
            filterSearch: true,
            filteredValue: filteredInfo.nLoadingPointId || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/slots/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.vcLoadingPointName}</div>
            </Link>, // ...getColumnSearchProps('userId'),
            sorter: (a, b) => a.nLoadingPointId - b.nLoadingPointId,
            sortDirections: ['ascend', 'descend', 'ascend'], // ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Нефтебаза',
            dataIndex: 'nStoreId',
            key: 'nStoreId',
            filters: storesFilter,
            onFilter: (value, record) => record.nStoreId === parseInt(value),
            filterSearch: true,
            filteredValue: filteredInfo.nStoreId || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/slots/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.vcStoreName}</div>
            </Link>, // ...getColumnSearchProps('userId'),
            sorter: (a, b) => a.nStoreId - b.nStoreId,
            sortDirections: ['ascend', 'descend', 'ascend'], // ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Клиент',
            dataIndex: 'nClientId',
            key: 'nClientId',
            filter: userFilter,
            onFilter: (value, record) => record.nClientId === parseInt(value),
            filterSearch: true,
            filteredValue: filteredInfo.nClientId || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/slots/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.vcClientName}</div>
            </Link>, // ...getColumnSearchProps('userId'),
            sorter: (a, b) => a.nClientId - b.nClientId,
            sortDirections: ['ascend', 'descend', 'ascend'], // ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Статус', // dataIndex: 'comment',
            dataIndex: 'vcStatus',
            key: 'vcStatus',
            // filterSearch: true,
            render: (item, record) => <div style={{width: '100%'}}>
                {record.vcStatus === "F" && <SuccessIcon style={{width: '25px', display: 'flex', margin: '-15px auto -5px auto'}}/>}
                {record.vcStatus === "B" && <WarningIcon style={{width: '25px', display: 'flex', margin: '-10px auto -5px auto'}}/>}
            </div>,
            width: '90px',
        },
    ];

    const rowSelectionChange = (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
                const data$ = fromFetch(`/api/slots/${item}`, {
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
        }}>Слоты</h5>

        <Space
            style={{
                margin: '0px', float: 'right'
            }}
        >
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
            loading={slotsStatus === "loading"}
            columns={columns}
            dataSource={slotsWithKey}
            onChange={handleTableChange}
            size={"small"}
            // pagination={{
            //     defaultPageSize: defaultPageSize,
            //     showSizeChanger: true,
            // }}
            pagination={false}
            scroll={{x: "max-content",}}
            rowSelection={rowSelection}
            rowKey={record => record.nSlotId}
            locale={tableLocale}
        />
        <CreateOrUpdateSlot open={showEditDialog}
                                data={cluster}
                                onClose={() => {
                                    setShowEditDialog(false)
                                    setSelectedClusterId("")
                                    navigate('/slots', {replace: true});
                                }}/>
    </>

}