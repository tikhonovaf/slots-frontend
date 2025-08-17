import {CButton, CCol, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,} from "@coreui/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useClusters} from "../../../hooks/reference/cluster/useClusters";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";
import {Button, Input, message, Space, Spin, Table, TableProps} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {ReactComponent as SuccessIcon} from "../../../assets/brand/success.svg"
import {ReactComponent as ErrorIcon} from "../../../assets/brand/error.svg"
import {ReactComponent as WarningIcon} from "../../../assets/brand/warning.svg"
import {TableLocale} from "antd/es/table/interface";
import {useVendors} from "../../../hooks/reference/vendor/useVendors";

export const SelectClusterModal = ({visible, title, text, name, onClose, onSubmit}) => {
    const [submitting, setSubmitting] = useState(false);

    const [connectionData, setConnectionData] = useState(new Map());
    const [clustersWithKey, setClustersWithKey] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [vendorFilter, setVendorFilter] = useState([]);
    const [isInitConnectionCheck, setIsInitConnectionCheck] = useState(false);
    const [connectionInProgress, setConnectionInProgress] = useState(false);
    const searchInput = useRef(null);
    const {data: clusters, status: clustersStatus, isFetched, refetch} = useClusters();
    const [vendors, vendorsStatus] = useVendors();

    useEffect(() => {
        setConnectionData(new Map())
    }, [])

    const clearFilters = () => {
        setFilteredInfo({});
        // setSearchText("");
    };

    useEffect(() => {
        if (isFetched && clusters && clusters.length > 0 && !isInitConnectionCheck) {
            setSelectedIds(clusters?.map(item => item?.id))
        }
    }, [clusters, isInitConnectionCheck, isFetched])

    useEffect(() => {
        if (isFetched && selectedIds.length > 0 && selectedRowKeys.length === 0 && !isInitConnectionCheck) {
            checkConnection()
            setIsInitConnectionCheck(true)
        }
    }, [isFetched, selectedIds, selectedRowKeys, isInitConnectionCheck])

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

    useEffect(() => {
        setConnectionInProgress(true)
        const ac = new AbortController()
        setTimeout(() => ac.abort(), 3000)

        selectedIds?.map((item) => {
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
                        // refetch()
                    }
                });

            } catch (e) {
                console.log(e)
            }
        })
        setConnectionInProgress(false)
    }, [clusters, connectionData])

    const checkConnection = useCallback(() => {

        setConnectionInProgress(true)
        const ac = new AbortController()
        setTimeout(() => ac.abort(), 3000)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedRows([])
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
    }, [selectedRowKeys, selectedIds, connectionData])


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


    const onSubmitInternal = async () => {
        if (selectedIds.length === 0) {
            message.error("Выберите кластер");
            return
        }
        const notAvailable = selectedIds.filter(item => connectionData.get(item) === "ERROR" || connectionData.get(item) === "NONE")
        if (notAvailable.length > 0) {
            message.error("Выберите только доступные кластеры");
            return
        }

        setSubmitting(true);
        try {
            const a = selectedRows.map(item => {
                return {
                    id: item?.id,
                    name: item?.name
                }
            })
            await onSubmit(a)?.();
        } finally {
            setSubmitting(false);
        }
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
        render: (item, record) =>
            <div style={{width: '100%'}}>{item}</div>
        ,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['ascend', 'descend', 'ascend'],
        ellipsis: true, // width: '30%'
    },

        {
            title: 'Тип кластера',
            dataIndex: 'vendorId',
            key: 'vendorId',
            filters: vendorFilter,
            filterSearch: true,
            filteredValue: filteredInfo.vendorId || null,
            onFilter: (value, record) => record.vendorId === parseInt(value),
            filter: vendorFilter,
            render: (item, record) =>
                <div style={{width: '100%'}}>{record.vendorName}</div>
            , // ...getColumnSearchProps('vendorId'),
            sorter: (a, b) => a.vendorName.length - b.vendorName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true, // width: '15%',
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
        setSelectedRows(selectedRows)
        setSelectedIds(selectedRowKeys)
    }
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };

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

    const tableLocale: TableLocale = {
        filterReset: <span
            onClick={clearFilters}>{'Очистить'}</span>, // emptyText: <div style={{backgroundImage:cilMenu}}>Нет данных</div>,
    }

    const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        setFilteredInfo(filters);
        // setSearchText(filters.clusterName);
    };


    return (
        <CModal
            visible={visible}
            alignment={"center"}
            unmountOnClose={true}
            size={"lg"}
            onClick={(e) => e.stopPropagation()}
        >
            <CModalHeader>
                <CModalTitle style={{fontSize: '17px'}}>
                    <bold>{title}</bold>
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div style={{fontColor: 'silver', fontSize: '15px', margin: '5px 0 20px 0'}}>{text}</div>
                <CCol className={"mb-3"}>

                    {/*<CFormSelect*/}
                    {/*    // label={"Кластер"}*/}
                    {/*    value={selectedCluster ? selectedCluster.id : ""}*/}
                    {/*    required*/}
                    {/*    onChange={(e) => {*/}
                    {/*        setSelectedCluster({*/}
                    {/*            ...selectedCluster,*/}
                    {/*            id: e.target.value,*/}
                    {/*            name: clusters?.find(item => item.id === parseInt(e.target.value)).name,*/}
                    {/*        })*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <option value={""} disabled selected hidden>*/}
                    {/*        Выберите значение*/}
                    {/*    </option>*/}
                    {/*    {clusters && clusters.length > 0 && clusters?.map((el) => (*/}
                    {/*        <option value={el?.id} key={el?.id}>*/}
                    {/*           <>{el?.name}</>*/}
                    {/*        </option>*/}
                    {/*    ))}*/}
                    {/*</CFormSelect>*/}

                    <Table
                        loading={clustersStatus === "loading"}
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

                </CCol>
            </CModalBody>
            <CModalFooter>
                <CButton
                    color={"primary"}
                    className={"modal-button"}
                    onClick={onSubmitInternal}
                    disabled={submitting || Array.from(connectionData.values()).includes("IN_PROGRESS") || clustersStatus === "loading"}
                >
                    Загрузить
                </CButton>
                <CButton
                    color={"primary-rgb"}
                    className={"new-migration-btn modal-button"}
                    onClick={onClose}
                >
                    Закрыть
                </CButton>
            </CModalFooter>
        </CModal>
    );
};
