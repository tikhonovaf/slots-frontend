import {useQuery} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";
import {StoreModel} from "../../../models/reference/store.model";
import {message} from "antd";


export function useStores(): [StoreModel[], 'loading' | 'error' | 'success', Promise] {

    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        console.log('useStores', fetchData);

        const response = await fetch(`/api/stores`, {
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
        [queryKeys.stores],
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
