import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../queryKeys";
import {useCookies} from "react-cookie";
import type {SlotStatusModel} from "../../models/slot/slot.status.model";

export function useSlotStatuses(): [SlotStatusModel[], 'loading' | 'error' | 'success', Promise] {
    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch('/api/slots/statuses', {
            method: 'POST',
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
            .then(data => {
                console.log('data', data);
                return data ? data.map(item => ({...item, key: item.nStatusId})) : []
            })
    }

    const {
        data,
        status,
        refetch
    } = useQuery(
        [queryKeys.slotStatuses],
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
