import dayjs from "dayjs";
import {isString} from "lodash";
import {
    STORAGE_NAME,
    STORAGE_ORGANIZATION_ID,
    STORAGE_ORGANIZATION_NAME,
    STORAGE_ROLE,
    STORAGE_ROLE_ID,
    STORAGE_USER_NAME
} from "../constants";


export const updateObjectInArray = (
    items,
    itemId,
    objPropName,
    newObjProps,
) => {
    return items.map((u) => {
        if (u[objPropName] === itemId) {
            return {...u, ...newObjProps};
        }
        return u;
    });
};

export function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isMac() {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

export function ensureDate(value) {
    if (value) {
        return isString(value) ? dayjs(value) : value;
    }
}

export function parseDate(value) {
    const date = new Date(value).toLocaleDateString("ru");
    const hours = new Date(value).toLocaleTimeString("ru").slice(0, -3);

    return {date, hours};
}

export function toIsoString(date) {
    const formatted = new Date(date)
    const pad = function (num) {
        return (num < 10 ? '0' : '') + num;
    };

    return formatted.getFullYear() +
        '-' + pad(formatted.getMonth() + 1) +
        '-' + pad(formatted.getDate()) +
        'T' + pad(formatted.getHours()) +
        ':' + pad(formatted.getMinutes()) +
        ':' + pad(formatted.getSeconds())
}

export function clearStorage() {
    sessionStorage.removeItem(STORAGE_NAME);
    sessionStorage.removeItem(STORAGE_ORGANIZATION_ID);
    sessionStorage.removeItem(STORAGE_ORGANIZATION_NAME);
    sessionStorage.removeItem(STORAGE_ROLE);
    sessionStorage.removeItem(STORAGE_ROLE_ID);
    sessionStorage.removeItem(STORAGE_USER_NAME);
}

