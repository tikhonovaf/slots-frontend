import {useMutation, useQueryClient} from "react-query";
import {useCookies} from "react-cookie";
import {message} from "antd";
import queryKeys from "../queryKeys";


export function useDeleteS3CloneSession(): [DeleteItem, 'idle' | 'loading' | 'success' | 'error'] {


    const queryClient = useQueryClient();
    const [removeCookie] = useCookies();

    const _useApi = async (id: string) => {
        const response = await fetch(`/clone/sessions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
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
        mutationFn: (id: string) => _useApi(id),
        onSuccess: (data) => {
            if (data.message || data.error) {
                message.error(data.message || data.error)
            } else {
                queryClient.invalidateQueries([queryKeys.cloneSessions]);
                message.success("Сессия копирования была удалена успешно");
            }
        }
    })
    return [mutate, status]
}

type DeleteItem = (id: string) => void