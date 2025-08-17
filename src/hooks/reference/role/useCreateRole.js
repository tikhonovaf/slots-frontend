import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";

import type {RoleModel} from "../../../models/reference/role.model";
import {message} from "antd";


export function useCreateRole(): CreateRole {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callback: any;

    const _useApi = async (data: ClusterModel, afterCreate: any) => {
        _callback = afterCreate;
        const response = await fetch(`/api/admin/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.status !== 200) {
            message.error("Роль не может быть создана");
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
                queryClient.invalidateQueries([queryKeys.roles]);
                message.success("Роль была создана успешно");
                _callback && _callback(data.id);
            }
        },

    })
    return mutate
}

type CreateRole = ({data: RoleModel, afterCreate: any}) => void