import CIcon from "@coreui/icons-react";
import {cilBrushAlt, cilPlus, cilTrash} from "@coreui/icons";
import {Button, Input, message, Space, Table, TableProps, Tooltip} from "antd";

import React, {useCallback, useEffect, useRef, useState} from "react";
import {DeleteModal} from "../../../components/DeleteModal";
import {Link} from "react-router-dom";
import {useModals} from "../../../hooks/useModals";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {TableLocale} from "antd/es/table/interface";
import CreateOrUpdateUser from "./CreateOrUpdateUser";
import {useDeleteUser} from "../../../hooks/reference/user/useDeleteUser";
import {useUser} from "../../../hooks/reference/user/useUser";
import {useUsers} from "../../../hooks/reference/user/useUsers";
import {useRoles} from "../../../hooks/reference/role/useRoles";
import {useDepartments} from "../../../hooks/reference/department/useDepartments";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";


export const UsersPage = () => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [clustersWithKey, setClustersWithKey] = useState([]);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const [users, usersStatus, refetch] = useUsers();
    const [user] = useUser(selectedUserId);
    const [deleteUser] = useDeleteUser();
    const [roles, rolesStatus] = useRoles();
    const [departments, departmentsStatus] = useDepartments();

    const handleSelect = (id) => {
        setSelectedUserId(id);
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
        if (users && users.length > 0) {
            result = users?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setClustersWithKey(result)
    }, [users]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление пользовтателя",
            text: 'Вы уверены, что хотите удалить пользователя ' + `${name}` + '?',
            onSubmit: async () => {
                deleteUser(id);
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
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'key',
            key: 'key',
            render: (item, record) => (<Link className={'table-link'} to={`/references/users/${record.id}`}>
                <div style={{color: 'gray'}}>{record.key}</div>
            </Link>),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },

        {
            title: 'Имя',
            dataIndex: 'firstName',
            key: 'firstName',
            ...getColumnSearchProps('firstName'),
            filteredValue: filteredInfo.firstName || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/users/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            sorter: (a, b) => a.firstName.length - b.firstName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },
        // {
        //     title: 'Отчество',
        //     dataIndex: 'secondName',
        //     key: 'secondName',
        //     ...getColumnSearchProps('secondName'),
        //     filteredValue: filteredInfo.secondName || null,
        //     filterSearch: true,
        //     render: (item, record) => <Link className={'table-link'} to={`/references/users/${record.id}`}
        //                                     onClick={() => handleSelect(record.id)}>
        //         <div style={{width: '100%'}}>{item}</div>
        //     </Link>,
        //     sorter: (a, b) => a.secondName.length - b.secondName.length,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '30%'
        // },
        {
            title: 'Фамилия',
            dataIndex: 'lastName',
            key: 'lastName',
            ...getColumnSearchProps('lastName'),
            filteredValue: filteredInfo.lastName || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/users/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            sorter: (a, b) => a.lastName.length - b.lastName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '20%'
        },
        // {
        //     title: 'Email',
        //     dataIndex: 'email',
        //     key: 'email',
        //     filterSearch: true,
        //     filteredValue: filteredInfo.email || null,
        //     render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
        //                                     onClick={() => handleSelect(record.id)}>
        //         <div style={{width: '100%'}}>{item}</div>
        //     </Link>,
        //     ...getColumnSearchProps('email'),
        //     sorter: (a, b) => a.email.length - b.email.length,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '15%',
        // },
        // {
        //     title: 'Статус',
        //     dataIndex: 'activity',
        //     key: 'activity',
        //     filterSearch: true,
        //     filteredValue: filteredInfo.activity || null,
        //     render: (item, record) => <Link className={'table-link'} to={`/references/users/${record.id}`}
        //                                     onClick={() => handleSelect(record.id)}>
        //         <div style={{width: '100%'}}>{item}</div>
        //     </Link>,
        //     ...getColumnSearchProps('activity'),
        //     sorter: (a, b) => a.activity.length - b.activity.length,
        //     sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '15%',
        // },
        {
            title: 'Роль',
            dataIndex: 'roleId',
            key: 'roleId',
            filterSearch: true,
            filteredValue: filteredInfo.roleId || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/users${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.roleName}</div>
            </Link>,
            ...getColumnSearchProps('roleId'),
            sorter: (a, b) => a.roleName.length - b.roleName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Отдел',
            dataIndex: 'departmentId',
            key: 'departmentId',
            filterSearch: true,
            filteredValue: filteredInfo.departmentId || null,
            render: (item, record) => <Link className={'table-link'} to={`/references/users/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{record.departmentName}</div>
            </Link>,
            ...getColumnSearchProps('departmentName'),
            sorter: (a, b) => a.departmentName.length - b.departmentName.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '15%',
        },
        // {
        //     title: 'Описание',
        //     dataIndex: 'comment',
        //     key: 'comment',
        //     ...getColumnSearchProps('comment'),
        //     filteredValue: filteredInfo.name || null,
        //     filterSearch: true,
        //     render: (item, record) => <Link className={'table-link'} to={`/references/clusters/${record.id}`}
        //                                     onClick={() => handleSelect(record.id)}>
        //         <div style={{width: '100%'}}>{item}</div>
        //     </Link>,
        //     // sorter: (a, b) => a.name.length - b.name.length,
        //     // sortDirections: ['ascend', 'descend', 'ascend'],
        //     ellipsis: true,
        //     // width: '30%'
        // },
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
        //                 <CDropdownItem onClick={() => onDelete(record?.id, record?.lastName)}>
        //                     Удалить
        //                 </CDropdownItem>
        //             </CDropdownMenu>
        //         </CDropdown>,
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

    const deleteItems = useCallback(() => {
        if (selectedIds.length === 0) {
            message.error("Выберите пользователя");
        }
        setDeleteInProgress(false)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedIds([])
        ids.map((item) => {
            try {
                const data$ = fromFetch(`/api/admin/strafUsers/${item}`, {
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
        }}>Пользователи</h5>

        <Space
            style={{
                margin: '0px', float: 'right'
            }}
        >
            <Tooltip title={"Добавить пользователя"}>
                <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                        onClick={() => setShowEditDialog(true)}/>
            </Tooltip>
            <Tooltip title={"Удалить пользователя"}>
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
            loading={usersStatus === "loading"}
            columns={columns}
            dataSource={clustersWithKey}
            onChange={onChange}
            size={"small"}
            // pagination={{
            //     defaultPageSize: defaultPageSize,
            //     showSizeChanger: true,
            // }}
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
        < CreateOrUpdateUser open={showEditDialog}
                             data={user}
                             onClose={() => {
                                 setShowEditDialog(false)
                                 setSelectedUserId("")
                                 navigate('/references/users', {replace: true});
                             }}/></>

}