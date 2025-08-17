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

import CreateOrUpdateDepartment from "./CreateOrUpdateDepartment";
import {useDepartments} from "../../../hooks/reference/department/useDepartments";
import {useDepartment} from "../../../hooks/reference/department/useDepartment";
import {useDeleteDepartment} from "../../../hooks/reference/department/useDeleteDepartment";
import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";


export const DepartmentsPage = () => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
    const [departmentsWithKey, setDepartmentsWithKey] = useState([]);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const [departments, recordTypesStatus, refetch] = useDepartments();
    const [department, recordTypeStatus] = useDepartment(selectedDepartmentId);
    const [deleteDepartment] = useDeleteDepartment();

    const handleSelect = (id) => {
        setSelectedDepartmentId(id);
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
        if (departments && departments.length > 0) {
            result = departments?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setDepartmentsWithKey(result)
    }, [departments]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление отдела",
            text: 'Вы уверены, что хотите удалить отдел ' + `${name}` + '?',
            onSubmit: async () => {
                deleteDepartment(id);
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
            render: (item, record) => (<Link className={'table-link'} to={`/references/departments/${record.id}`}>
                <div style={{color: 'gray'}}>{record.key}</div>
            </Link>),
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.key - b.key,
            sortDirections: ['ascend', 'descend', 'ascend'],
            width: '5%'
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            filteredValue: filteredInfo.name || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/departments/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            width: '30%'
        },

        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            ...getColumnSearchProps('description'),
            filteredValue: filteredInfo.name || null,
            filterSearch: true,
            render: (item, record) => <Link className={'table-link'} to={`/references/departments/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            // sorter: (a, b) => a.name.length - b.name.length,
            // sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
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
        //                 <CDropdownItem onClick={() => onDelete(record?.id, record?.name)}>
        //                     Удалить
        //                 </CDropdownItem>
        //             </CDropdownMenu>
        //         </CDropdown>,
        // },
    ];

    const deleteItems = useCallback(() => {
        if (selectedIds.length === 0) {
            message.error("Выберите роль");
        }
        setDeleteInProgress(false)
        const ids = selectedIds
        setSelectedRowKeys([])
        setSelectedIds([])
        ids.map((item) => {
            try {
                const data$ = fromFetch(`/api/admin/departments/${item}`, {
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

    return <>
        <h5 style={{
            margin: '0 0 30px 0', float: 'left'
        }}>Отделы</h5>

        <Space
            style={{
                margin: '0px', float: 'right'
            }}
        >
            <Tooltip title={"Добавить отдел"}>
                <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                        onClick={() => setShowEditDialog(true)}/>
            </Tooltip>
            <Tooltip title={"Удалить отдел"}>
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
            loading={recordTypesStatus === "loading"}
            columns={columns}
            dataSource={departmentsWithKey}
            onChange={onChange}
            size={"small"}
            pagination={false}
            scroll={{x: "max-content",}}
            rowSelection={rowSelection}
            rowKey={record => record.id}

            locale={tableLocale}
        />
        <CreateOrUpdateDepartment open={showEditDialog}
                                  data={department}
                                  onClose={() => {
                                      setShowEditDialog(false)
                                      setSelectedDepartmentId("")
                                      navigate('/references/departments', {replace: true});
                                  }}/></>

}