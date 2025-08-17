import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {UserModel} from "../../../models/reference/user.model";
import {message} from "antd";


export function useUpdateUser(): UpdateCluster {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callBack: any;

    const _useApi = async (data: UserModel, afterUpdate: any) => {
        _callBack = afterUpdate;
        const response = await fetch(`/api/admin/strafUsers/${data?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.status === 406) {
            message.error("Пользователь с таким логином уже существует");
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
                queryClient.invalidateQueries([queryKeys.users]);
                message.success("Кластер был обновлен успешно");
                _callBack && _callBack();
            }
        },

    })
    return mutate
}

type UpdateCluster = ({ data: UserModel , afterUpdate: any }) => void