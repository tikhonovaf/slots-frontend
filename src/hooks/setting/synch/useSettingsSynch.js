import {useQuery} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";
import {SettingSynchModel} from "../../../models/setting/settingSynch.model";
import {message} from "antd";


export function useSettingsSynch(): [SettingSynchModel[], 'loading' | 'error' | 'success', Promise] {


    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch(`/api/setting/settingSync`, {
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
        status,
        refetch
    } = useQuery(
        [queryKeys.settingsSynch],
        () => fetchData(),
        {
            onSuccess: (data: any) => {
                if (data.message) {
                    message.error(data.message)
                }
            },
        })

    return [
        data,
        status,
        refetch
    ]
}
