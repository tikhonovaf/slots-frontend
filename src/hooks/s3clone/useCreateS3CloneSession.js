import {useMutation, useQueryClient} from "react-query";
import {useCookies} from "react-cookie";
import {message} from "antd";
import {S3CloneSessionModel} from "../../models/s3clone/s3cloneSession.model";
import queryKeys from "../queryKeys";


export function useCreateS3CloneSession(): CreateSetting {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies()


    let _callback: any;

    const _useApi = async (data: S3CloneSessionModel, afterCreate: any) => {
        _callback = afterCreate;
        const response = await fetch(`/clone/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.status === 403) {
            removeCookie('session', {path: '/'});
            window.location.reload()
        }
        if (response.status !== 200) {
            message.error("Сессия копирования не может быть создана");
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
                queryClient.invalidateQueries([queryKeys.cloneSessions]);
                message.success("Сессия копирования была создана успешно");
                _callback && _callback(data.id);
            }
        },

    })
    return mutate
}

type CreateSetting = ({ data: SettingBalancingModel, afterCreate: any }) => void