import React, {useEffect, useRef, useState} from "react";

import {Button, Input, Space, Table, TableProps, Tooltip} from "antd";
import {ClearOutlined, SearchOutlined} from "@ant-design/icons";

import moment from 'moment-timezone';
import {TableLocale} from "antd/es/table/interface";
import type {UserModel} from "../../models/reference/user.model";
import {useUsers} from "../../hooks/reference/user/useUsers";
import {useAudit} from "../../hooks/report/useAudit";
import type {AuditModel} from "../../models/report/auditModel";
import {useResources} from "../../hooks/reference/admin/useResources";
import {useActions} from "../../hooks/reference/admin/useActions";

const Audit = () => {

    const searchInput = useRef(null);
    const [auditWithKey, setAuditWithKey] = useState([]);
    const [userId, setUserId] = useState("");
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [resourceFilter, setResourceFilter] = useState([]);
    // const [actionFilter, setActionFilter] = useState([]);
    const [userFilter, setUserFilter] = useState([]);
    const [resourcesFilter, setResourcesFilter] = useState([]);
    const [usersOptions, setUsersOptions] = useState([]);
    const [activePage, setActivePage] = useState(0);
    const [pageSize, setPageSize] = useState(15);
    const [sortParams, setSortParams] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const [filterParams, setFilterParams] = useState();
    // const [filterDate, setFilterDate] = useQueryParam('date', StringParam);
    const [sortDir, setSortDir] = useState('descend');
    const [currentPageParam, setCurrentPageParam] = useState()

    const [resources, resourcesStatus] = useResources()
    const [actions, actionsStatus] = useActions()
    const [users, usersStatus] = useUsers()
    const {data: audit, hasNextPage, fetchNextPage, status: auditStatus, refetch} = useAudit(currentPageParam);


    useEffect(() => {
        if (resourcesStatus === "success" && resources && resources.length > 0) {
            setResourceFilter(resources?.map((item) => {
                return {
                    value: item.name,
                    text: item.name,
                }
            }))
        }
    }, [resources, resourcesStatus]);

    // useEffect(() => {
    //     if (actionsStatus === "success" && actions && actions.length > 0) {
    //         setActionFilter(actions?.map((item) => {
    //             return {
    //                 value: item.name,
    //                 text: item.name,
    //             }
    //         }))
    //     }
    // }, [actions, actionsStatus]);

    useEffect(() => {
        if (usersStatus === "success" && users && users.length > 0) {
            setUserFilter(users?.map((item: UserModel) => {
                return {value: item?.lastName, text: item?.lastName, selected: true, checked: true}
            }))
            setUsersOptions(users?.map((item: UserModel) => {
                return {value: item?.id, label: item?.lastName}
            }))
        }
    }, [users, usersStatus]);


    // const getResourceColor = (id) => {
    //     return id === dataResourceType.administartion ?
    //         "success" : id === dataResourceType.restKey ?
    //             "dark" : id === dataResourceType.clusterCard ?
    //                 "would-be-active" : id === dataResourceType.migrationCard ?
    //                     "danger" : id === dataResourceType.migration ?
    //                         "warning" : "dark"
    // }

    const getActionColor = (activity) => {
        return activity?.includes("Создание") ?
            "success" : activity?.includes("Установка статуса") ?
                "dark" : activity?.includes("Изменение") ?
                    "would-be-active" : activity?.includes("Удаление") ?
                        "danger" : activity?.includes("Запуск") ?
                            "warning" : "dark"
    }
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

    const onChange: TableProps<AuditModel>['onChange'] = (pagination, filters, sorter, extra) => {
        let filter = filterParams || {}
        let sort = sortParams || {columnName: 'id', sortDirection: "DESC"}

        // if (sorter?.hasOwnProperty("column")) {
        //     setSortDir(sorter.order)
        //     sort = [
        //         {
        //             columnName: sorter.field === 'key' ? 'id' : sorter.field,
        //             sortDirection: sorter.order === 'ascend' ? "ASC" : "DESC"
        //         }
        //     ]
        // }


        if (filters?.hasOwnProperty("userName")) {
            if (filters['userName'] && filters['userName'].length > 0) {
                filter = {
                    ...filterParams,
                    userName: filters['userName'].toString()
                };
            }
        }
        if (filters?.hasOwnProperty("resource")) {
            if (filters['resource'] && filters['resource'].length > 0) {
                filter = {
                    ...filterParams,
                    resource: filters['resource'].toString()
                };
            }
        }
        if (filters?.hasOwnProperty("action")) {
            if (filters['action'] && filters['action'].length > 0) {
                filter = {
                    ...filterParams,
                    action: filters['action'].toString()
                };
            }
        }
        if (filters?.hasOwnProperty("objectName")) {
            if (filters['objectName'] && filters['objectName'].length > 0) {
                filter = {
                    ...filterParams,
                    objectName: filters['objectName'].toString()
                };
            }
        }
        // if (filters?.hasOwnProperty("startDate")) {
        //     if (filters['startDate'] && filters['startDate'].length > 0) {
        //         const startDateFilter = filters['startDate'][0];
        //         const startDateFrom = startDateFilter[0]?.format("YYYY-MM-DDTHH:mm:ss");
        //         const startDateTo = startDateFilter[1]?.format("YYYY-MM-DDTHH:mm:ss");
        //
        //         filter = {
        //             ...filterParams,
        //             startDateFrom: startDateFrom,
        //             startDateTo: startDateTo
        //         };
        //     }
        // }
        // if (filters?.hasOwnProperty("finishDate")) {
        //     if (filters['finishDate'] && filters['finishDate'].length > 0) {
        //         const endDateFilter = filters['finishDate'][0];
        //         const finishDateFrom = endDateFilter[0]?.format("YYYY-MM-DDTHH:mm:ss");
        //         const finishDateTo = endDateFilter[1]?.format("YYYY-MM-DDTHH:mm:ss");
        //
        //         filter = {
        //             ...filterParams,
        //             finishDateFrom: finishDateFrom,
        //             finishDateTo: finishDateTo
        //         };
        //     }
        // }
        // if (filterDate && filterDate !== "") {
        //     filter = {
        //         finishDateFrom: filterDate + "T00:00:00",
        //         finishDateTo: filterDate + "T23:59:59"
        //     }
        //     sort = [
        //         {
        //             columnName: 'finishDate',
        //             sortDirection: "ASC"
        //         }
        //     ]
        // }

        const params = {
            pageSize: pagination.pageSize,
            current: pagination.current - 1,
            sort: sort,
            filter: filter
        }
        // console.log("params", params)
        setCurrentPageParam(params)
        setSortParams(sort);
        setFilterParams(filter)
        setPageSize(pagination.pageSize)
        setActivePage(pagination.current >= 1 ? pagination.current - 1 : 0);
        hasNextPage && fetchNextPage({
            pageParam: params
        })
    };


    useEffect(() => {
        let result = []
        if (auditStatus === "success" && audit && audit.pages.length > 0) {
            const total = audit.pages[0].page?.totalElements;
            setTotalPages(total);
            result = audit.pages[0].auditFullViewDtos?.sort((a, b) => sortDir === "descend" ? b.id - a.id : a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: sortDir === 'descend' ? total - index - activePage * pageSize : index + 1 + activePage * pageSize
                }))
        }
        setAuditWithKey(result)

    }, [audit, auditStatus]);


    const clearFilters = () => {
        setFilteredInfo({})
        setFilterParams({})
        setSortParams({})
        setCurrentPageParam({})
        // setFilterDate("")
        hasNextPage && fetchNextPage({
            pageParam:
                {
                    pageSize: pageSize,
                    current: activePage,
                    sort: sortParams,
                    filter: {}
                },

        });
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };


    const tableLocale: TableLocale = {
        filterReset: <span onClick={clearFilters}>{'Очистить'}</span>,
    }

    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            render: (item, record) => (<div style={{color: 'gray'}}>{record.key}</div>),
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },

        {
            title: 'Пользователь',
            dataIndex: 'userName',
            key: 'userName',
            filters: userFilter,
            filterMode: 'tree',
            filterMultiple: false,
            filterSearch: true,
            // filteredValue: filteredInfo?.userName || "",
            render: (item, record) =>
                <div style={{width: '100%'}}>{record.userName}</div>,
            // onFilter: (value, record) => record.userName == value,//record.userId === parseInt(value),
            sorter: (a, b) => a.userName.length - b.userName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,

        },
        {
            title: 'Ресурс',
            dataIndex: 'resource',
            key: 'resource',
            filters: resourceFilter,
            filterMode: 'tree',
            filterMultiple: false,
            filterSearch: true,
            // filteredValue: filteredInfo.resource || null,
            // onFilter: (value, record) => record.resource.includes(value),
            render: (item, record) =>
                // <StatusBadge color={getResourceColor(record.resourceId)} small>
                <>{item}</>,
            // </StatusBadge>,
            sortDirections: ['ascend', 'descend', 'ascend'],
            sorter: (a, b) => a.resource.length - b.resource.length,
            ellipsis: true,

        },
        {
            title: 'Действие',
            dataIndex: 'action',
            key: 'action',
            // filters: actionFilter,
            filterSearch: true,
            filterMultiple: false,
            filterMode: 'tree',
            ...getColumnSearchProps('action'),
            // filteredValue: filteredInfo.action || null,
            // onFilter: (value, record) => record?.action.includes(value),
            render: (item, record) =>
                // <StatusBadge color={getActionColor(item)} small>
                <>{item}</>,
            // </StatusBadge>,
            sorter: (a, b) => a.action.length - b.action.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,

        },
        {
            title: 'Объект',
            dataIndex: 'objectName',
            key: 'objectName',
            filterMode: 'tree',
            filterMultiple: false,
            ...getColumnSearchProps('objectName'),
            filterSearch: true,
            // filteredValue: filteredInfo.objectName || null,
            // onFilter: (value, record) => record?.objectName.includes(value),
            // sorter: (a, b) => a.objectName.length - b.objectName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,

        },
        {
            title: 'Дата',
            dataIndex: 'createDateTime',
            key: 'createDateTime',
            ...getColumnSearchProps('createDateTime'),
            filterSearch: true,
            // filteredValue: filteredInfo.createDateTime || null,
            render: (item, record) => (<>{moment(record?.createDateTime).format("YYYY-MM-DD HH:mm:ss")}</>),
            // onFilter: (value, record) => record?.createDateTime.includes(value),
            // sorter: (a, b) => new Date(a.createDateTime).getTime() - new Date(b.createDateTime).getTime(),
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,

        },
    ];


    return (<>
            <h5 style={{
                margin: '0 0 0px 0',
                float: 'left'
            }}>Аудит</h5>


            <Space
                style={{
                    margin: '20px 0 20px 0px',
                    float: 'right'
                }}
            >

                <Tooltip title={"Очистить фильтр"}>
                    <Button shape="circle" icon={<ClearOutlined/>} onClick={clearFilters}/>
                </Tooltip>
            </Space>
            <Table
                loading={auditStatus === "loading"}
                columns={columns}
                dataSource={auditWithKey}
                onChange={onChange}
                size={"small"}
                pagination={{
                    defaultPageSize: defaultPageSize,
                    showSizeChanger: true,
                }}
                locale={tableLocale}
            />

        </>
    );
};

export default Audit;
