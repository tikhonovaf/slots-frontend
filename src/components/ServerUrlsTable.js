import React, {FC, memo, useCallback, useEffect, useMemo, useState} from 'react'
import {CCol, CContainer, CRow} from "@coreui/react";
import {Checkbox, message, Spin, Tooltip} from "antd";
import CIcon from "@coreui/icons-react";
import {cilPlus, cilTrash} from "@coreui/icons";
import InputMask from "react-input-mask";
import {ReactComponent as SuccessIcon} from "../assets/brand/success.svg"
import {ReactComponent as ErrorIcon} from "../assets/brand/error.svg"
import type {ClusterAccessStatusModel} from "../models/reference/clusterAccessStatus.model";

import type {ServerModel} from "../models/reference/server.model";
import type {ClusterModel} from "../models/reference/cluster.model";

export type ServerUrlsTableProps = {
    data?: ClusterModel | ServerModel,
    type: "cluster" | "server",
    connectionData?: ClusterAccessStatusModel,
    checkConnectionStatus?: 'idle' | 'loading' | 'success' | 'error',
    updateDataCallback: Function,
    maxNum?: number
}
export const ServerUrlsTable: FC<ServerUrlsTableProps> = memo(({
                                                                   data,
                                                                   type,
                                                                   maxNum,
                                                                   connectionData,
                                                                   checkConnectionStatus,
                                                                   updateDataCallback
                                                               }) => {


    const [key, setKey] = useState(data?.length - 1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [urls, setUrls] = useState();

    useEffect(() => {
        setUrls(prepareUrlsForward(type === "cluster" ? data?.clusterUrls : data?.serverUrls))
    }, [data])

    const prepareUrlsBack = (_data) => {
        const result = []
        _data?.map((item, index) => {
            result.push({
                url: (item["http_" + index] || "http") + "://" + (item["url_" + index] || ""),
                port: item["port_" + index]
            })
        })
        return result
    }

    const prepareUrlsToDeleteBack = (_data, indexes) => {
        const result = []
        _data?.map((item) => {
            if (indexes.includes(item.key)) {
                result.push({
                    url: (item["http_" + item.key] || "http") + "://" + item["url_" + item.key],
                    port: item["port_" + item.key]
                })
            }
        })
        return result
    }

    const prepareUrlsForward = (_data) => {
        const result = []
        _data?.map((item, index) => {
            let obj = {key: index}
            obj["http_" + index] = item?.url?.split("://")[0]
            obj["url_" + index] = item?.url?.split("://")[1]
            obj["port_" + index] = item?.port
            result.push(obj)
        })
        return result
    }

    const onChangeInput = useCallback((e: any, key: any) => {
        const {name, value} = e.target
        const editData: any[] = urls?.map((item: any) =>
            item.key === key && name ? {...item, [name]: value} : item,
        )
        // data['serverUrls']=prepareUrlsBack(editData)
        const aa = prepareUrlsBack(editData)
        updateDataCallback(aa)
    }, [urls])


    const selectRow = (id: any, e: any) => {
        let newRowData = selectedRowKeys
        if (e.target.checked) {
            newRowData.push(id)
        } else {
            newRowData = selectedRowKeys.filter((el) => {
                return id !== el
            })
        }
        setSelectedRowKeys([...newRowData])
    }
    const addRow = () => {
        const a = key + 1
        setKey(a)
        const newRow: any = {
            key: key,
            url: "url_" + key,
            port: "port_" + key

        }
        let newArray
        if (!urls) {
            newArray = [].concat([], newRow);
        } else {
            newArray = [].concat(urls, newRow);
        }
        updateDataCallback(prepareUrlsBack([...newArray]))
    }
    const deleteRow = () => {
        if (selectedRowKeys?.length === 0) {
            message.error('Выберите значение');
            return
        }
        const indexes = []
        const newRowData = urls?.filter((el, index) => {
            const condition = !selectedRowKeys.includes(el.key)
            if (condition) {
                indexes.push(index)
            }
            return condition
        })
        setUrls([...newRowData])
        updateDataCallback(prepareUrlsToDeleteBack(newRowData, indexes))
        setSelectedRowKeys([])
    }

    const showData = useMemo(() => {

        return <div style={{gridArea: 'data', margin: maxNum > 1 ? '20px -10px' : '20px 0 0 -40px'}}>
            <CContainer>
                {urls && urls?.length > 0 &&
                    <CRow>
                        <CCol>
                            <div style={{margin: '0px 0px 0px 190px', width: '100%', color: 'gray'}}>URL или IP</div>
                        </CCol>
                        <CCol>
                            <div style={{margin: '0px 0px 0px 135px', color: 'gray'}}>Порт</div>
                        </CCol>

                        <CCol>
                            <div style={{margin: '0px 0px 0px 15px', color: 'gray'}}>
                                {maxNum > 1 && data?.id && <span>Статус</span>}
                            </div>
                        </CCol>
                    </CRow>
                }

                {urls && urls?.length > 0 && urls?.map((item, index) =>
                    <CRow key={index}>

                        {maxNum > 1 ? <Checkbox
                            style={{margin: '-5px 15px 0px 0px', width: '20px', float: 'left'}}
                            onChange={(e: any) => selectRow(index, e)}
                        /> : <div style={{width: '40px'}}/>}

                        <InputMask
                            required
                            name={'http_' + index}
                            value={item['http_' + index]}
                            style={{
                                display: 'block',
                                margin: '7px 10px 10px 0',
                                width: '70px',
                                padding: '7px 15px',
                                borderWidth: '0.8px',
                                borderStyle: 'solid',
                                borderRadius: '6px',
                                borderColor: 'rgb(211, 211, 211)'
                            }}
                            onChange={(e) => onChangeInput(e, index)}
                            maskChar={null}
                            alwaysShowMask={true}
                            placeholder={"http(s)://"}
                            mask={"http\a"}
                        />

                        {/*<Tooltip title={"Введите IP адрес или URL"}>*/}

                        <InputMask
                            name={'url_' + index}
                            value={item['url_' + index] || ""}
                            style={{
                                display: 'block',
                                margin: '7px 10px 10px 0',
                                width: '245px',
                                padding: '7px 15px',
                                borderWidth: '0.8px',
                                borderStyle: 'solid',
                                borderRadius: '6px',
                                borderColor: `${(item['url_' + index] === "" || !item['url_' + index]) ? 'red' : 'rgb(211, 211, 211)'}`
                            }}
                            onChange={(e) => onChangeInput(e, index)}
                            maskChar={null}
                            alwaysShowMask={false}
                        />

                        {/*</Tooltip>*/}

                        <InputMask
                            style={{
                                display: 'block',
                                margin: '7px 0 10px 0',
                                width: '65px',
                                padding: '7px 15px',
                                borderWidth: '0.8px',
                                borderStyle: 'solid',
                                borderRadius: '6px',
                                borderColor: `${(item['port_' + index] === "" || !item['port_' + index]) ? 'red' : 'rgb(211, 211, 211)'}`
                            }}
                            formatChars={{
                                '9': '[0-9\.]',
                            }}
                            name={'port_' + index}
                            value={item['port_' + index] || ""}
                            onChange={(e) => onChangeInput(e, index)}
                            mask="9999"
                            maskChar={null}
                            alwaysShowMask={false}
                            required
                        />

                        {maxNum > 1 && checkConnectionStatus === "loading" &&
                            <Spin style={{float: 'right', width: "30px", margin: '12px 0 0 15px'}}/>}

                        {maxNum > 1 && checkConnectionStatus === "success" && connectionData?.infoUrls && connectionData?.infoUrls.length > 0 &&
                            connectionData?.infoUrls[index]?.status === "OK" &&
                            <Tooltip title={"Успешное подключение"}> <SuccessIcon
                                style={{float: 'right', width: '40px', margin: '-45px 0 0 0px'}}/></Tooltip>}

                        {maxNum > 1 && (checkConnectionStatus === "error" || (checkConnectionStatus === "success" && connectionData?.infoUrls && connectionData?.infoUrls.length > 0 && connectionData?.infoUrls[index]?.status === "ERROR")) &&
                            <Tooltip title={"Ошибка при подключении"}><ErrorIcon
                                style={{float: 'right', width: '55px', margin: '-7px 0 0 20px'}}/></Tooltip>}

                        {/*{(maxNum > 1 && checkConnectionStatus === "error") &&*/}
                        {/*    <Tooltip title={"Адрес недоступен"}>*/}
                        {/*        <NoAccessIcon*/}
                        {/*            style={{float: 'right', width: '50px', margin: '-7px 0 0 15px'}}/></Tooltip>}*/}
                    </CRow>
                )}

            </CContainer>
        </div>
    }, [urls, connectionData, checkConnectionStatus, maxNum])

    return (
        <div>
            <div className="paramsPanel ">
                {maxNum > 1 && <div style={{gridArea: 'menu'}}>
                    <Tooltip title={"Удалить адрес"}>
                        <div className="clasters-btn"
                             style={{float: 'right', margin: '0px -20px 0 10px'}}
                             onClick={deleteRow}
                        >
                            <CIcon icon={cilTrash} size="custom" className="me-2"/>
                        </div>
                    </Tooltip>
                    <Tooltip title={"Добавить адрес"}>
                        <div className="clasters-btn"
                             style={{float: 'right', margin: '0'}}
                             onClick={addRow}
                        >
                            <CIcon icon={cilPlus} size="custom" className="me-2"/>

                        </div>
                    </Tooltip>

                </div>}
            </div>
            {showData}

        </div>
    )
})

