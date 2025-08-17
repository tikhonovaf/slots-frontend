import {locale, STORAGE_LOCALE} from "../constants";

export function useLang(): locale {

    return sessionStorage.getItem(STORAGE_LOCALE) || window._env_?.REACT_APP_LANG || 'RU'

}
