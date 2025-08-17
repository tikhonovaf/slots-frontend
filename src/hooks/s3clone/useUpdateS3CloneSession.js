import {useMutation, useQueryClient} from "react-query";
import {useCookies} from "react-cookie";
import {message} from "antd";
import {S3CloneSessionModel} from "../../models/s3clone/s3cloneSession.model";
import queryKeys from "../queryKeys";

export function useUpdateS3CloneSession(): UpdateItem {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callBack: any;

    const _useApi = async (data: S3CloneSessionModel, afterUpdate: any) => {
        _callBack = afterUpdate;
        const response = await fetch(`/clone/sessions/${data?.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (response.status !== 200) {
            message.error("Сессия копирования не может быть обновлена");
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
                queryClient.invalidateQueries([queryKeys.cloneSessions]);
                message.success("Сессия копирования была обновлена успешно");
                _callBack && _callBack();
            }
        },

    })
    return mutate
}

type UpdateItem = ({ data: S3CloneSessionModel, afterUpdate: any }) => void