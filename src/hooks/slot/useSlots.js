import {useQuery, UseQueryResult} from "react-query";
import queryKeys from "../queryKeys";
import {useCookies} from "react-cookie";
import type {SlotModel} from "../../models/slot/slot.model";
import {DATE_FORMAT, DATE_DISPLAY_FORMAT} from "../../constants";

export function useSlots(filters): UseQueryResult<SlotModel[]> {

    const { nStoreId, nClientId, nStatusId, dDateBegin, dDateEnd } = filters || {};
    const requestBody = {
        nStoreIds: nStoreId,
        nClientIds: nClientId,
        nStatusId: nStatusId && nStatusId.length > 0 ? nStatusId[0] : undefined,
        dDateBegin: dDateBegin?.format(DATE_FORMAT),
        dDateEnd: dDateEnd?.format(DATE_FORMAT)
    };

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

        return response.json()
            .then((data) => {
                return data && data.length > 0
                    ? data.map((item, index) => ({
                            ...item, key: item.nSlotId
                        }))
                    : []
            })
    }

    return useQuery(
        [queryKeys.slots, requestBody],
        () => fetchData(),
    )
}
