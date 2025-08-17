import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import {message} from "antd";


export function useDeleteClusters(): [DeleteClusters, 'idle' | 'loading' | 'success' | 'error'] {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies();

    const _useApi = async (ids) => {
        const response = await fetch(`/api/clusters`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(ids),
        })

        if (response.status === 403) {
            removeCookie('session', {path: '/'});
            window.location.reload();
        }
        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
    }

    const {mutate, status} = useMutation({
        mutationFn: (ids) => _useApi(ids),
        onSuccess: (data) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.clusters]);
                message.success("Кластер был удален успешно");
            }
        }
    })
    return [mutate, status]
}

type DeleteClusters = (ids: []) => void