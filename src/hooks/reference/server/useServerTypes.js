import {useQuery} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";
import {ServerTypeModel} from "../../../models/reference/server.model";
import {message} from "antd";

export function useServerTypes(): [ServerTypeModel[], 'loading' | 'error' | 'success'] {


    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch(`/api/ref/serverTypes`, {
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
        [queryKeys.serverTypes],
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
