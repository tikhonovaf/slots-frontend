import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {ServerModel} from "../../../models/reference/server.model";
import {message} from "antd";


export function useUpdateServer(): UpdateServer {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callBack: any;

    const _useApi = async (data: ServerModel, afterUpdate: any) => {
        _callBack = afterUpdate;
        const response = await fetch(`/api/servers/${data?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.status !== 200) {
            message.error("Сервер не может быть обновлен");
            return
        }

        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
    }

    const {mutate} = useMutation({
        mutationFn: ({data, afterUpdate}) => _useApi(data, afterUpdate),
        onSuccess: (data: any) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.servers]);
                message.success("Сервер был обновлен успешно");
                _callBack && _callBack();
            }
        },

    })
    return mutate
}

type UpdateServer = ({ data: ServerModel, afterUpdate: any }) => void