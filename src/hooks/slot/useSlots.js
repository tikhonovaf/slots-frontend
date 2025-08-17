import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../queryKeys";
import {useCookies} from "react-cookie";
import type {SlotModel} from "../../models/slot/slot.model";

export function useSlots(filters): UseQueryResult<SlotModel[]> {

    const { nStoreId } = filters;
    const requestBody = { nStoreIds: nStoreId };

    // 
    const [, , removeCookie] = useCookies()

    const fetchData = async () => {
        const response = await fetch('/api/slots/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestBody),
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
        [queryKeys.slots, requestBody],
        () => fetchData(),
    )
}
