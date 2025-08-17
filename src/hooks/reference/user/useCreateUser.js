import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {UserModel} from "../../../models/reference/user.model";
import {message} from "antd";

export function useCreateUser(): CreateUser {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()

    let _callback: any;

    const _useApi = async (data: UserModel, afterCreate: any) => {
        _callback = afterCreate;
        const response = await fetch(`/api/admin/strafUsers`, {
            method: 'POST',
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
        mutationFn: ({data, afterCreate}) => _useApi(data, afterCreate),
        onSuccess: (data: any) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.users]);
                message.success("Пользователь был создан успешно");
                _callback && _callback(data.id);
            }
        },

    })
    return mutate
}

type CreateUser = ({data: UserModel, afterCreate: any}) => void