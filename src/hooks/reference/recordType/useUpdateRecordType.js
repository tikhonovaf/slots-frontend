import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../../queryKeys";
import {useCookies} from "react-cookie";
import type {MethodModel} from "../../../models/reference/method.model";
import {message} from "antd";


export function useUpdateRecordType(): UpdateRecordType {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callBack: any;

    const _useApi = async (data: MethodModel, afterUpdate: any) => {
        _callBack = afterUpdate;
        const response = await fetch(`/api/ref/recordTypes/${data?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.status !== 204) {
            message.error("Метод не может быть обновлен");
            return
        }
        
        return response.text()
            .then((data) => {
                return (data ? JSON.parse(data) : {})
            })
    }

    const {mutate} = useMutation({
        mutationFn: ({data, afterUpdate}) => _useApi(data, afterUpdate),
        onSuccess: (data: any) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.recordTypes]);
                message.success("S3 метод был обновлен успешно");
                _callBack && _callBack();
            }
        },

    })
    return mutate
}

type UpdateRecordType = ({ data: MethodModel, afterUpdate: any }) => void