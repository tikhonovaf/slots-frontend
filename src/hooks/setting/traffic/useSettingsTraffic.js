import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";


export function useSettingsTraffic(): UseQueryResult {


    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch(`/api/setting/settingTraffic`, {
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

    return useQuery(
        [queryKeys.settingsTraffic],
        () => fetchData(),
        {
            // onSuccess: (data: any) => {
            //     if (data.message) {
            //         message.error(data.message)
            //     }
            // },
        })

}
