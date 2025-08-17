import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {DepartmentModel} from "../../../models/reference/department.model";
import {message} from "antd";


export function useUpdateDepartment(): UpdateDepartment {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callBack: any;

    const _useApi = async (data: DepartmentModel, afterUpdate: any) => {
        _callBack = afterUpdate;
        const response = await fetch(`/api/admin/departments/${data?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.status !== 200) {
            message.error("Отдел не может быть обновлен");
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
                queryClient.invalidateQueries([queryKeys.departments]);
                message.success("Отдел был обновлен успешно");
                _callBack && _callBack();
            }
        },

    })
    return mutate
}

type UpdateDepartment = ({ data: DepartmentModel, afterUpdate: any }) => void