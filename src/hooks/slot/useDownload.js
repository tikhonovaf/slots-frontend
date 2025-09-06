import {useMutation, useQueryClient} from "react-query";

import queryKeys from "../queryKeys";
import {useCookies} from "react-cookie";
import {message} from "antd";
import {DATE_FORMAT} from "../../constants";
import { RepeatOneSharp } from "@material-ui/icons";

export function useDownload(): any {
    const _useApi = async (filters) => {
        const { nStoreId, nClientId, nStatusId, dDateBegin, dDateEnd } = filters || {};
        const requestBody = {
            nStoreIds: nStoreId,
            nClientIds: nClientId,
            nStatusId: nStatusId && nStatusId.length > 0 ? nStatusId[0] : undefined,
            dDateBegin: dDateBegin?.format(DATE_FORMAT),
            dDateEnd: dDateEnd?.format(DATE_FORMAT)
        };

        console.log(requestBody);

        const fetchResponse = await fetch(`/api/slots/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/octet-stream',
                // 'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
        });

        // Проверяем статус ответа
        if (!fetchResponse.ok) {
            throw new Error(`HTTP error! status: ${fetchResponse.status}`);
        }

        // Получаем blob
        const blob = await fetchResponse.blob();

        // Создаем URL для скачивания
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Пытаемся получить имя файла из заголовков
        const contentDisposition = fetchResponse.headers.get('Content-Disposition');
        let filename = 'slots.pdf'; // значение по умолчанию
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1];
            }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Очистка
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        return blob;
    }

    const {mutate} = useMutation({
        mutationFn: ({filters}) => _useApi(filters)

    })
    return mutate
}
