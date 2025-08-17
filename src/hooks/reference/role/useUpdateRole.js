import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {RoleModel} from "../../../models/reference/role.model";
import {message} from "antd";


export function useUpdateRole(): UpdateRole {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callBack: any;

    const _useApi = async (data: RoleModel, afterUpdate: any) => {
        _callBack = afterUpdate;
        const response = await fetch(`/api/admin/roles/${data?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.status !== 200) {
            message.error("Роль не может быть обновлена");
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
                queryClient.invalidateQueries([queryKeys.roles]);
                message.success("Роль была обновлена успешно");
                _callBack && _callBack();
            }
        },

    })
    return mutate
}

type UpdateRole = ({ data: RoleModel, afterUpdate: any }) => void