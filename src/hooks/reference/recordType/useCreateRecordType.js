import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {MethodModel} from "../../../models/reference/method.model";
import {message} from "antd";

export function useCreateRecordType(): CreateRecordType {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callback: any;

    const _useApi = async (data: MethodModel, afterCreate: any) => {
        _callback = afterCreate;
        const response = await fetch(`/api/ref/recordTypes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.status !== 204) {
            message.error("Метод не может быть создан");
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
                queryClient.invalidateQueries([queryKeys.recordTypes]);
                message.success("S3 метод был создан успешно");
                _callback && _callback(data.id);
            }
        },

    })
    return mutate
}

type CreateRecordType = ({ data: MethodModel, afterCreate: any }) => void