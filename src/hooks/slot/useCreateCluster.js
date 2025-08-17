import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {ClusterModel} from "../../../models/reference/cluster.model";
import {message} from "antd";


export function useCreateCluster(): CreateCluster {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callback: any;

    const _useApi = async (data: ClusterModel, afterCreate: any) => {
        _callback = afterCreate;
        const response = await fetch(`/api/clusters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.status !== 200) {
            message.error("Кластер не может быть создан");
            return
        }
        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
    }

    const {mutate} = useMutation({
        mutationFn: ({data, afterCreate}) => _useApi(data, afterCreate),
        onSuccess: (data: any) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.clusters]);
                message.success("Кластер был создан успешно");
                _callback && _callback(data.id);
            }
        },

    })
    return mutate
}

type CreateCluster = ({data: ClusterModel, afterCreate: any}) => void