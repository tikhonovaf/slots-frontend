import {useQuery} from "react-query";
import {useCookies} from "react-cookie";
import queryKeys from "../queryKeys";

import {ReportBalancingModel} from "../../models/report/reportBalancing.model";
import {message} from "antd";


export function useBalancingSettingsReport(): [ReportBalancingModel[], 'loading' | 'error' | 'success'] {


    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch(`/api/reports/settingBalancing/json`, {
            method: 'GET',
            headers: {
                // 'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/octet-stream',
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
        [queryKeys.settingBalanceReport],
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
        status
    ]
}
