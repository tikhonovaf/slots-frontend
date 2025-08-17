import {useQuery} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";


import {SettingBalancingModel} from "../../../models/setting/settingBalancing.model";
import {message} from "antd";

export function useSettingBalancing(id): [SettingBalancingModel, 'loading' | 'error' | 'success'] {


    const [removeCookie] = useCookies()
    const fetchData = async () => {
        const response = await fetch(`/api/setting/settingBalancing/${id}`, {
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
        [queryKeys.settingBalancing, {id: id}],
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
