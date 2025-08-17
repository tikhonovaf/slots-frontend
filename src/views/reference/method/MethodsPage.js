import CIcon from "@coreui/icons-react";
import {Button, Input, Space, Table, TableProps, Tooltip} from "antd";

import React, {useEffect, useRef, useState} from "react";
import {DeleteModal} from "../../../components/DeleteModal";
import {Link} from "react-router-dom";
import {CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle} from "@coreui/react";
import {cilMenu} from "../../../assets/brand/cilMenu";
import {useModals} from "../../../hooks/useModals";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {TableLocale} from "antd/es/table/interface";
import {useRecordTypes} from "../../../hooks/reference/recordType/useRecordTypes";
import {useRecordType} from "../../../hooks/reference/recordType/useRecordType";
import {useDeleteRecordType} from "../../../hooks/reference/recordType/useDeleteRecordType";
import CreateOrUpdateMethod from "./CreateOrUpdateMethod";
import {cilBrushAlt, cilPlus} from "@coreui/icons";


export const MethodsPage = () => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedRecordTypeId, setSelectedRecordTypeId] = useState("");
    const [recordTypesWithKey, setRecordTypesWithKey] = useState([]);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);

    const [recordTypes, recordTypesStatus] = useRecordTypes();
    const [recordType, recordTypeStatus] = useRecordType(selectedRecordTypeId);
    const [deleteRecordType] = useDeleteRecordType();

    const handleSelect = (id) => {
        setSelectedRecordTypeId(id);
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
        if (recordTypes && recordTypes.length > 0) {
            result = recordTypes?.sort((a, b) => a.id - b.id)
                .map((item, index) => ({
                    ...item,
                    key: index + 1
                }))
        }
        setRecordTypesWithKey(result)
    }, [recordTypes]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление типа записи",
            text: 'Вы уверены, что хотите удалить метод ' + `${name}` + '?',
            onSubmit: async () => {
                deleteRecordType(id);
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
            render: (item, record) => (<Link className={'table-link'} to={`/references/records/${record.id}`}
                                             onClick={() => handleSelect(record.id)}>
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
            render: (item, record) => <Link className={'table-link'} to={`/references/records/${record.id}`}
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
            render: (item, record) => <Link className={'table-link'} to={`/references/records/${record.id}`}
                                            onClick={() => handleSelect(record.id)}>
                <div style={{width: '100%'}}>{item}</div>
            </Link>,
            // sorter: (a, b) => a.name.length - b.name.length,
            // sortDirections: ['ascend', 'descend', 'ascend'],
            ellipsis: true,
            // width: '30%'
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            width: '5%',
            render: (item, record) => <>
                {(record.id >= 100) ? <CDropdown
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
                </CDropdown> : <div/>}</>,
        },
    ];

    return <>

        <h5 style={{
            margin: '0 0 30px 0',
            float: 'left'
        }}>Методы S3</h5>

        <Space
            style={{
                margin: '0px',
                float: 'right'
            }}
        >

            <Tooltip title={"Добавить метод"}>
                <Button shape="rounde" icon={<CIcon icon={cilPlus}/>}
                        onClick={() => setShowEditDialog(true)}/>
            </Tooltip>

            <Tooltip title={"Очистить фильтр"}>
                <Button shape="rounde" icon={<CIcon icon={cilBrushAlt}/>} onClick={clearFilters}/>
            </Tooltip>
        </Space>

        <Table
            loading={recordTypesStatus === "loading"}
            columns={columns}
            dataSource={recordTypesWithKey}
            onChange={onChange}
            size={"small"}
            pagination={false}
            scroll={{x: "max-content",}}
            // rowSelection={rowSelection}
            // rowKey={record => record.id}
            locale={tableLocale}
        />
        <CreateOrUpdateMethod open={showEditDialog}
                              data={recordType}
                              onClose={() => {
                                  setShowEditDialog(false)
                                  setSelectedRecordTypeId("")
                                  navigate('/references/records', {replace: true});
                              }}/></>

}