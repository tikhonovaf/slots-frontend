import {useQuery} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";
import {ClientUserModel} from "../../../models/reference/client-user.model";
import {message} from "antd";


export function useClientUsers(nClientId): [ClientUserModel[], 'loading' | 'error' | 'success', Promise] {

    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch(`/api/clients/users/${nClientId}`, {
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

        return response.json()
            .then((data) => {
                return data && data.length > 0
                ? data?.map((item, index) => ({
                        ...item, key: item.nUserId
                    }))
                : []
            })
    };

    const {
        data,
        status,
        refetch
    } = useQuery(
        [queryKeys.clientUsers, nClientId],
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
