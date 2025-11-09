import {useQuery} from "react-query";
import queryKeys from "../../queryKeys";

import {useCookies} from "react-cookie";
import {LoadingPointModel} from "../../../models/reference/loading-point.model";
import {message} from "antd";


export function useLoadingPoints(nStoreId): [LoadingPointModel[], 'loading' | 'error' | 'success', Promise] {

    console.log('useLoadingPoints', nStoreId);

    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        if(nStoreId) {
            const response = await fetch(`/api/loadingPoints/${nStoreId}`, {
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

            return (response || '[]').json()
                .then((data) => {
                    return data && data.length > 0
                    ? data?.map((item, index) => ({
                            ...item, key: item.nLoadingPointId
                        }))
                    : []
                })
        }
        else {
            return [];
        }
    };

    const {
        data,
        status,
        refetch
    } = useQuery(
        [queryKeys.loadingPoints, nStoreId],
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
