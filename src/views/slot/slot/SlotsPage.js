import CIcon from "@coreui/icons-react";
import {Button, Input, message, Space, DatePicker, Table, TableProps, Tooltip} from "antd";
import moment from 'moment';

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import dayjs from "dayjs";
import {DeleteModal} from "../../../components/DeleteModal";
import {Link} from "react-router-dom";
import {useModals} from "../../../hooks/useModals";
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router";
import {TableLocale} from "antd/es/table/interface";
import {useSlots} from "../../../hooks/slot/useSlots";
import {useSlotStatuses}  from "../../../hooks/slot/useSlotStatuses";
import ChangeSlotStatusDialog from "./ChangeSlotStatusDialog";
import {useStores} from "../../../hooks/reference/store/useStores";
import {useClients} from "../../../hooks/reference/client/useClients";
import {useChangeSlotStatus} from "../../../hooks/slot/useChangeSlotStatus";
import {useDownload} from "../../../hooks/slot/useDownload";
import {ReactComponent as SuccessIcon} from "../../../assets/brand/success.svg"
import {ReactComponent as ErrorIcon} from "../../../assets/brand/error.svg"
import {ReactComponent as WarningIcon} from "../../../assets/brand/warning.svg"
import {DATE_FORMAT, DATE_DISPLAY_FORMAT} from "../../../constants";

import {fromFetch} from "rxjs/internal/observable/dom/fetch";
import {catchError, of, switchMap} from "rxjs";

import {cilBrushAlt, cilCloudDownload} from "@coreui/icons";


export const SlotsPage = () => {

    const navigate = useNavigate();
    const modals = useModals();
    const params = useParams();

    const [showChangeSlotStatusDialog, setShowChangeSlotStatusDialog] = useState(false);
    const [changeSlotStatusType, setChangeSlotStatusType] = useState(undefined);
    const [slotsWithKey, setSlotsWithKey] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [connectionInProgress, setConnectionInProgress] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState({ dDateBegin: dayjs(), dDateEnd: dayjs().add(1, 'day')});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [defaultPageSize, setDefaultPageSize] = useState(15);
    const [userFilter, setUserFilter] = useState([]);

    const [freeing, setFreeing] = useState(false);
    const [freeResponse, setFreeResponse] = useState(undefined);
    const freeSlots = useChangeSlotStatus("free");
    const fetchDownload = useDownload();

    const {data: slots, state: slotsStatus, refetch} = useSlots(filteredInfo);
    const [stores, storesStatus] = useStores();
    const [clients, clientsStatus] = useClients();
    const [statuses, statusesStatus] = useSlotStatuses();
    const { RangePicker } = DatePicker;

    useEffect(() => {
        if (connectionInProgress) {
            message.info(`Проверка соединения в процессе...`)
        }
    }, [connectionInProgress])

    useEffect(() => {
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
                    onClick={handleClearFilters}
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

    const storesFilter = useMemo(() => {
        return (storesStatus === "success" && stores)
            ? stores.map(store => ({ value: store.nStoreId, text: store.vcName }))
            : []
    }, [stores, storesStatus]);
    const clientsFilter = useMemo(() => {
        return (clientsStatus === "success" && stores)
            ? clients.map(client => ({ value: client.nClientId, text: client.vcName }))
            : []
    }, [clients, clientsStatus]);
    const statusesFilter = useMemo(() => {
        return (statusesStatus === "success" && statuses)
            ? statuses.map(status => ({ value: status.nStatusId, text: status.vcName }))
            : []
    }, [statuses, statusesStatus]);

    const onDelete = (id, name) => {
        modals.openModal(DeleteModal, (modalId) => ({
            title: "Удаление кластера",
            text: 'Вы уверены, что хотите удалить кластер ' + `${name}` + '?',
            onSubmit: async () => {
                modals.closeModal(modalId);
            },
        }));
    };
    const handleClearFilters = () => {
        setFilteredInfo({});
        setSearchText("");
    };
    const handleExcelClick = () => {
        fetchDownload({filters: filteredInfo});
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const tableLocale: TableLocale = {
        filterReset: <span
            onClick={handleClearFilters}>{'Очистить'}</span>, // emptyText: <div style={{backgroundImage:cilMenu}}>Нет данных</div>,
    }

    const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
        setFilteredInfo({
            ...filteredInfo,
            ...filters
        });
    };

    const handlePeriodChange = (dates, dateStrings) => {
        const [dDateBegin, dDateEnd] = dates;

        setFilteredInfo({
            ...filteredInfo,
            dDateBegin,
            dDateEnd
        });
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
            render: (item, record) => <div style={{width: '100%'}}>{record.vcLoadingPointName}</div>,
            sorter: (a, b) => a.nLoadingPointId - b.nLoadingPointId,
            sortDirections: ['ascend', 'descend', 'ascend'], // ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Нефтебаза',
            dataIndex: 'nStoreId',
            key: 'nStoreId',
            filters: storesFilter,
            filterSearch: true,
            filteredValue: filteredInfo.nStoreId || null,
            render: (item, record) => <div style={{width: '100%'}}>{record.vcStoreName}</div>,
            sorter: (a, b) => a.nStoreId - b.nStoreId,
            sortDirections: ['ascend', 'descend', 'ascend'], // ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Клиент',
            dataIndex: 'nClientId',
            key: 'nClientId',
            filters: clientsFilter,
            filterSearch: true,
            filteredValue: filteredInfo.nClientId || null,
            render: (item, record) => <div style={{width: '100%'}}>{record.vcClientName}</div>,
            sorter: (a, b) => a.nClientId - b.nClientId,
            sortDirections: ['ascend', 'descend', 'ascend'], // ellipsis: true,
            // width: '15%',
        },
        {
            title: 'Статус', // dataIndex: 'comment',
            dataIndex: 'nStatusId',
            key: 'nStatusId',
            filterSearch: true,
            filters: statusesFilter,
            filterMultiple: false,
            filteredValue: filteredInfo.nStatusId || null,
            render: (item, record) => <div style={{width: '100%'}}>
                {record.vcStatusCode === "F" && <SuccessIcon style={{width: '25px', display: 'flex', margin: '-15px auto -5px auto'}}/>}
                {record.vcStatusCode === "B" && <WarningIcon style={{width: '25px', display: 'flex', margin: '-10px auto -5px auto'}}/>}
                {record.vcStatusName}
            </div>,
            width: '90px',
        },
    ];

    const rowSelectionChange = (selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys)
    }

    const rowSelection = {
        selectedRowKeys: selectedRowKeys, onSelectAll: (selected, selectedRows, changeRows) => {
            if (selectedRowKeys.length === 0) {
                setSelectedRowKeys([]);
            }
        }, onChange: (selectedRowKeys, selectedRows) => {
            rowSelectionChange(selectedRowKeys, selectedRows)
        },
    };

    const handleClickReserve = () => {
        setShowChangeSlotStatusDialog(true);
        setChangeSlotStatusType("reserve");
    }

    const handleClickFree = () => {
        // Очищаем ответы перед выполнением
        setFreeResponse(undefined);
        setFreeing(true);

        // Выполняем запроса
        freeSlots({
            data: selectedRowKeys.map(nSlotId => ({nSlotId})),
            afterSuccess: (data) => {
                // Если успешно, то заполняем ответы для отображения
                setFreeResponse(data);
                setFreeing(false);
                setSelectedRowKeys([]);
            },
            afterError: (err) => {
                // Снимаем режим выполнения
                setFreeing(false);
            }
        })

    }

    return <>
        <h5 style={{
            margin: '0 0 30px 0', float: 'left'
        }}>Слоты</h5>

        <Space style={{margin: 0, float: 'right'}}>
            <Tooltip title={"Зарезервировать выбранные слоты"}>
                <Button
                    shape="rounde"
                    onClick={handleClickReserve}
                    disabled={selectedRowKeys.length==0}
                >
                    Резервировать
                </Button>
            </Tooltip>
            <Tooltip title={"Снять резерв с выбранных слотов"}>
                <Button
                    shape="rounde"
                    onClick={handleClickFree}
                    disabled={selectedRowKeys.length==0}
                    loading={freeing}
                >
                    Снять с резерва
                </Button>
            </Tooltip>
            <Tooltip title={"Установить фильтр по периоду слотов"}>
                <RangePicker
                    placeholder={["Начало периода", "Окончание периода"]}
                    onChange={handlePeriodChange}
                    format={DATE_DISPLAY_FORMAT}
                    value={[filteredInfo.dDateBegin, filteredInfo.dDateEnd]}
                />
            </Tooltip>
            <Tooltip title={"Скачать файл Excel со списком слотов"}>
                <Button shape="rounde" icon={<CIcon icon={cilCloudDownload}/>} onClick={handleExcelClick}/>
            </Tooltip>
            <Tooltip title={"Очистить фильтр"}>
                <Button shape="rounde" icon={<CIcon icon={cilBrushAlt}/>} onClick={handleClearFilters}/>
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
        <ChangeSlotStatusDialog
            open={showChangeSlotStatusDialog}
            data={selectedRowKeys}
            clients={clients}
            selectedSlots={selectedRowKeys}
            changeSlotStatusType={changeSlotStatusType}
            onClose={(successReserve) => {
                setShowChangeSlotStatusDialog(false)
                setChangeSlotStatusType(undefined)
                if(successReserve) {
                    setSelectedRowKeys([]);
                }
            }}
        />
    </>

}