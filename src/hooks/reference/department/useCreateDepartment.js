import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {DepartmentModel} from "../../../models/reference/department.model";
import {message} from "antd";

export function useCreateDepartment(): CreateDepartment {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callback: any;

    const _useApi = async (data: DepartmentModel, afterCreate: any) => {
        _callback = afterCreate;
        const response = await fetch(`/api/admin/departments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.status !== 200) {
            message.error("Отдел не может быть создан");
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
                queryClient.invalidateQueries([queryKeys.departments]);
                message.success("Отдел был создан успешно");
                _callback && _callback(data.id);
            }
        },

    })
    return mutate
}

type CreateDepartment = ({data: DepartmentModel, afterCreate: any}) => void