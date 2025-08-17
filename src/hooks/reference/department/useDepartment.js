import {useQuery} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";

import type {DepartmentModel} from "../../../models/reference/department.model";
import {message} from "antd";

export function useDepartment(id): [DepartmentModel, 'loading' | 'error' | 'success'] {


    const [removeCookie] = useCookies()
    const fetchData = async () => {
        const response = await fetch(`/api/admin/departments/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        })
        if (response.status === 403) {
            removeCookie('session', {path: '/'});
            window.location.reload()
        }

        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
    }

    const {
        data,
        status
    } = useQuery(
        [queryKeys.department, {id: id}],
        () => fetchData(),
        {
            enabled: !!id,
            onSuccess: (data: any) => {
                if (data.message) {
                    message.error(data.message)
                }
            },
        })

    return [
        data,
        status
    ]
}
